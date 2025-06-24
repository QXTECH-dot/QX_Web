import matplotlib.pyplot as plt
import pandas
import folium
import json
from branca.element import MacroElement
from jinja2 import Template
from branca.colormap import linear
from shapely.geometry import shape, MultiPolygon, Polygon

class SetMapBackground(MacroElement):
    def __init__(self, color="white"):
        super().__init__()
        self._name = "SetMapBackground"
        self._template = Template(u"""
            {% macro html(this, kwargs) %}
            <style>
                .leaflet-container {
                    background: {{ this.color }} !important;
                }
                .leaflet-control-attribution {
                     display: none !important;
                }
            </style>
            {% endmacro %}
        """)
        self.color = color
        
# 读取数据
data1_map = pandas.read_excel("8165DC01.xlsx", sheet_name="Table 4", skiprows=4, usecols="A:N")
data1_map = data1_map.rename(columns={"Unnamed: 0": "State"})
map_data = data1_map[['State','Operating at end of financial year']].dropna(how='all')

#找到最新一年数据
year_rows = map_data[map_data.iloc[:, 0].astype(str).str.match(r"\d{4}\D{1}\d{2}")]
last_year_index = year_rows.index[-1] if not year_rows.empty else None
map_data = map_data.loc[last_year_index+1:, ['State', 'Operating at end of financial year']]
map_data = map_data.dropna(how='any')
map_data = map_data.iloc[:-1,:]
map_data.loc[map_data['State']=='Other Territories/Currently Unknown','State'] = 'Other Territories'


# 地图对象
m = folium.Map(
    location=[-25.2744, 133.7751],
    zoom_start=5,
    tiles=None,
    max_bounds=True,
    min_zoom=4,
    max_zoom=8,
)

m.get_root().add_child(SetMapBackground(color="white"))

# 限制边界
m.fit_bounds([[-44, 112], [-10, 155]])


# 加载澳大利亚区域边界
with open("australia.geojson") as f:
    australia = json.load(f)


# 州名缩写
state_abbr = {
    "New South Wales": "NSW",
    "Victoria": "VIC",
    "Queensland": "QLD",
    "South Australia": "SA",
    "Western Australia": "WA",
    "Tasmania": "TAS",
    "Northern Territory": "NT",
    "Australian Capital Territory": "ACT",
}

#添加每个州对应的链接    
state_links = {
    "New South Wales": "/companies/?location=NSW&page=1",
    "Victoria": "/companies/?location=VIC&page=1",
    "Queensland": "/companies/?location=QLD&page=1",
    "South Australia": "/companies/?location=SA&page=1",
    "Western Australia": "/companies/?location=WA&page=1",
    "Tasmania": "/companies/?location=TAS&page=1",
    "Australian Capital Territory": "/companies/?location=ACT&page=1",
    "Northern Territory": "/companies/?location=NT&page=1",
    "Other Territories": "/companies",
}

# 只保留澳大利亚区域的坐标（Polygon 或 MultiPolygon）
australia_coords = []
for feature in australia["features"]:
    geometry = feature["geometry"]
    if geometry["type"] == "Polygon":
        australia_coords.append(geometry["coordinates"])
    elif geometry["type"] == "MultiPolygon":
        australia_coords.extend(geometry["coordinates"])

state_value_dict = dict(zip(map_data["State"], map_data["Operating at end of financial year"]))
      
for feature in australia["features"]:
    state_name = feature["properties"]["name"]
    feature["properties"]["value"] = state_value_dict.get(state_name, 0)
    feature["properties"]["url"] = state_links.get(state_name, "#")

# 创建连续渐变色带
vmin = map_data["Operating at end of financial year"].min()
vmax = map_data["Operating at end of financial year"].max()
colormap = linear.YlOrRd_09.scale(vmin, vmax)
colormap.caption = "Operating Businesses (latest year)"

# 映射数值写入 GeoJSON
state_value_dict = dict(zip(
    map_data["State"], 
    map_data["Operating at end of financial year"]
))

for feature in australia["features"]:
    state_name = feature["properties"]["name"]
    value = state_value_dict.get(state_name)
    feature["properties"]["value"] = value
    geom = shape(feature["geometry"])  # shapely 的几何对象
    centroid = geom.centroid

    abbr = state_abbr.get(state_name, "")
    if abbr:
        folium.map.Marker(
            location=[centroid.y, centroid.x],
            icon=folium.DivIcon(html=f"""
                <div style="font-size: 14px; font-weight: bold; color: black;
                            text-shadow: 0 0 3px white;">
                    {abbr}
                </div>
            """)
        ).add_to(m)

# 绘制 GeoJson 图层，使用渐变颜色
folium.GeoJson(
    data=australia,
    name="States",
    style_function=lambda feature: {
        'fillColor': colormap(feature["properties"]["value"]) if feature["properties"]["value"] else "white",
        'color': 'black',
        'weight': 1,
        'fillOpacity': 0.8
    },
    tooltip=folium.GeoJsonTooltip(
        fields=["name", "value"],
        aliases=["State:", "Operating Businesses:"],
        localize=True
    ),
    highlight_function=lambda x: {'weight': 2, 'color': 'orange'},
    on_each_feature="""
        function(feature, layer) {
            layer.on({
                click: function(e) {
                    var url = feature.properties.url;
                    if (url) {
                        window.open(url, '_blank');
                    }
                }
            });
        }
    """
).add_to(m)

# 添加颜色图例
colormap.add_to(m)

# 保存
m.save("public/australia-map/map.html")



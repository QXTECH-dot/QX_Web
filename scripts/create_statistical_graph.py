import matplotlib.pyplot as plt
import pandas
import folium
import json
from branca.element import MacroElement
from jinja2 import Template

class SetMapBackground(MacroElement):
    def __init__(self, color="#000000"):
        super().__init__()
        self._template = Template(f"""
            <style>
                .leaflet-container {{
                    background: {color} !important;
                }}
            </style>
        """)
        
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
    max_zoom=8
)

# 限制边界
m.fit_bounds([[-44, 112], [-10, 155]])


# 加载澳大利亚区域边界
with open("australia.geojson") as f:
    australia = json.load(f)
    

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


# 添加图层，不同州不同颜色
folium.Choropleth(
    geo_data=australia,
    name="choropleth",
    data=map_data,
    columns=["State", "Operating at end of financial year"],
    key_on="feature.properties.name",  # 要和 GeoJSON 中的属性字段一致
    fill_color="YlOrRd",  # 可选：YlOrRd, BuPu, PuRd, etc.
    fill_opacity=0.8,
    line_opacity=0.2,
    legend_name="Operating Businesses (latest year)",
    nan_fill_color="white"
).add_to(m)

folium.GeoJson(
    australia,
    name="States",
    tooltip=folium.GeoJsonTooltip(
        fields=["name", "value"],
        aliases=["State:", "Operating Businesses:"],
        localize=True
    ),
    style_function=lambda x: {
        'fillColor': 'white',
        'color': 'black',
        'weight': 1,
        'fillOpacity': 0.2
    }
).add_to(m)

# 保存
m.save("public/australia-map/map.html")



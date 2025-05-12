# Logo处理方案

这个方案提供了一个完整的logo处理流程，从上传到显示，确保各种尺寸和比例的logo都能以最佳方式呈现给用户。

## 功能特点

- **统一处理**: 将各种尺寸和比例的logo统一处理为1:1比例
- **透明背景**: 保留logo的透明背景，确保在各种背景色上显示良好
- **响应式显示**: 根据不同设备屏幕大小自动调整显示尺寸
- **多种样式**: 支持圆形、圆角、边框、阴影等多种显示效果
- **错误处理**: 图片加载失败时自动显示占位图或公司首字母

## 组件结构

整个方案包含以下组件：

1. **后端处理脚本** (`process_logo.py`): 
   - 处理上传的logo图片
   - 转换为统一的1:1比例
   - 保留透明背景
   - 确保图片质量

2. **上传脚本** (`upload_logos.py`):
   - 集成logo处理功能
   - 匹配公司名称和logo
   - 上传到Firebase存储

3. **CSS样式** (`styles/logo.css`):
   - 定义logo容器样式
   - 提供响应式布局
   - 支持多种显示效果

4. **React组件** (`components/LogoDisplay.js`):
   - 提供可复用的logo显示组件
   - 支持多种显示参数
   - 处理加载错误情况

## 使用方法

### 处理和上传logo

```bash
# 处理单个logo
python scripts/process_logo.py path/to/logo.png -o output/path.png -s 300

# 处理整个文件夹
python scripts/process_logo.py path/to/logo_folder -o output_folder -s 300

# 上传logo到Firebase
python scripts/upload_logos.py
```

### 在React中使用

```jsx
import LogoDisplay from '../components/LogoDisplay';

// 基本使用
<LogoDisplay src="https://example.com/logo.png" alt="Company Name" />

// 小尺寸圆形logo，带边框和悬停效果
<LogoDisplay 
  src="https://example.com/logo.png" 
  alt="Company Name"
  size="sm"
  shape="circle"
  hasBorder={true}
  hover={true}
/>

// 大尺寸带阴影的logo
<LogoDisplay 
  src="https://example.com/logo.png" 
  alt="Company Name"
  size="lg"
  hasShadow={true}
/>
```

## 技术细节

### 图像处理逻辑

1. 读取原始图像
2. 创建一个1:1比例的透明背景画布
3. 按比例缩放原始图像，使其适合画布
4. 将缩放后的图像居中放置在画布上
5. 保存为PNG格式以保留透明度

### CSS实现

- 使用`aspect-ratio: 1/1`确保容器始终为正方形
- 使用`object-fit: contain`确保图像完整显示且不变形
- 使用媒体查询实现响应式布局

### React组件参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | string | - | Logo URL |
| alt | string | 'Company Logo' | 替代文本 |
| size | string | 'md' | 尺寸: 'sm', 'md', 'lg' |
| shape | string | 'normal' | 形状: 'normal', 'rounded', 'circle' |
| hasBorder | boolean | false | 是否显示边框 |
| hasShadow | boolean | false | 是否显示阴影 |
| hover | boolean | false | 是否启用悬停效果 |
| style | object | {} | 额外的样式 |

## 维护和扩展

- 调整`process_logo.py`中的参数可以更改输出图像的大小和质量
- 修改`logo.css`可以添加更多的显示效果
- 扩展`LogoDisplay.js`组件可以增加更多功能，如动画效果

## 注意事项

- 确保安装必要的Python依赖: `pip install Pillow pandas firebase-admin`
- 处理大量图像时可能需要较长时间
- 上传到Firebase需要正确的凭证配置 
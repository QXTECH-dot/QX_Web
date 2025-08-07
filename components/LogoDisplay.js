import React from 'react';
import '../styles/logo.css';

/**
 * LogoDisplay组件 - 用于展示公司logo
 * 
 * @param {Object} props
 * @param {string} props.src - logo图片URL
 * @param {string} props.alt - 替代文本
 * @param {string} props.size - 尺寸: 'sm', 'md', 'lg'（默认为'md'）
 * @param {string} props.shape - 形状: 'normal', 'rounded', 'circle'（默认为'normal'）
 * @param {boolean} props.hasBorder - 是否显示边框
 * @param {boolean} props.hasShadow - 是否显示阴影
 * @param {boolean} props.hover - 是否启用悬停效果
 * @param {Object} props.style - 额外的样式
 * @returns {JSX.Element}
 */
const LogoDisplay = ({ 
  src, 
  alt = 'Company Logo', 
  size = 'md', 
  shape = 'normal', 
  hasBorder = false, 
  hasShadow = false, 
  hover = false,
  style = {},
  ...otherProps 
}) => {
  // 构建className
  const getContainerClassName = () => {
    const classes = ['logo-container'];
    
    // 尺寸
    if (size === 'sm') classes.push('logo-container-sm');
    if (size === 'md') classes.push('logo-container-md');
    if (size === 'lg') classes.push('logo-container-lg');
    
    // 形状
    if (shape === 'rounded') classes.push('logo-container-rounded');
    if (shape === 'circle') classes.push('logo-container-circle');
    
    // 额外效果
    if (hasBorder) classes.push('logo-container-bordered');
    if (hasShadow) classes.push('logo-container-shadow');
    if (hover) classes.push('logo-container-hover');
    
    return classes.join(' ');
  };
  
  return (
    <div className={getContainerClassName()} style={style} {...otherProps}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="logo-image" 
          onError={(e) => {
            // 图片加载失败时的处理
            e.target.onerror = null;
            e.target.src = '/placeholder-logo.png'; // 设置默认占位图
          }}
        />
      ) : (
        // 没有logo时显示占位图或公司名首字母
        <div 
          style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#888',
            fontSize: size === 'sm' ? '1.5rem' : size === 'lg' ? '2.5rem' : '2rem',
            fontWeight: 'bold'
          }}
        >
          {alt ? alt.charAt(0).toUpperCase() : '?'}
        </div>
      )}
    </div>
  );
};

export default LogoDisplay; 
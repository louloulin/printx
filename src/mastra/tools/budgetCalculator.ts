import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// 读取材料数据
const readMaterialsData = () => {
  try {
    const dataPath = path.join(process.cwd(), 'src/data/materials.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading materials data:', error);
    return { materials: [] };
  }
};

// 预算计算工具
export const budgetCalculatorTool = createTool({
  id: 'calculateRenovationBudget',
  description: '根据房间大小、装修范围、材料质量和中国地区计算详细的装修预算',
  inputSchema: z.object({
    roomSize: z.number().describe('房间大小（平方米）'),
    renovationScope: z.enum(['full', 'partial', 'specific']).describe('装修范围（全面、部分、特定）'),
    materialQuality: z.enum(['high', 'medium', 'budget']).describe('材料质量（高端、中档、经济型）'),
    location: z.string().describe('中国城市或地区'),
    additionalFeatures: z.array(z.string()).optional().describe('附加功能，如智能家居、定制家具等')
  }),
  outputSchema: z.object({
    totalBudget: z.number(),
    breakdown: z.record(z.string(), z.number()),
    estimatedTimeframe: z.string(),
    recommendations: z.array(z.string())
  }),
  execute: async ({ context }) => {
    const { roomSize, renovationScope, materialQuality, location, additionalFeatures = [] } = context;
    
    // 基础单价（元/平方米）
    let basePricePerSqm = 0;
    
    // 根据材料质量确定基础单价
    switch (materialQuality) {
      case 'high':
        basePricePerSqm = 2500;
        break;
      case 'medium':
        basePricePerSqm = 1500;
        break;
      case 'budget':
        basePricePerSqm = 800;
        break;
    }
    
    // 根据装修范围调整价格
    let scopeMultiplier = 1;
    switch (renovationScope) {
      case 'full':
        scopeMultiplier = 1;
        break;
      case 'partial':
        scopeMultiplier = 0.7;
        break;
      case 'specific':
        scopeMultiplier = 0.4;
        break;
    }
    
    // 根据城市调整价格
    let locationMultiplier = 1;
    const firstTierCities = ['北京', '上海', '广州', '深圳'];
    const secondTierCities = ['杭州', '南京', '成都', '武汉', '西安', '重庆', '苏州', '天津', '宁波', '郑州'];
    
    if (firstTierCities.some(city => location.includes(city))) {
      locationMultiplier = 1.2;
    } else if (secondTierCities.some(city => location.includes(city))) {
      locationMultiplier = 1.1;
    } else {
      locationMultiplier = 1;
    }
    
    // 计算基础预算
    const baseTotal = roomSize * basePricePerSqm * scopeMultiplier * locationMultiplier;
    
    // 计算附加功能费用
    let additionalCost = 0;
    const additionalFeatureCosts = {
      '智能家居': roomSize * 300,
      '定制家具': roomSize * 500,
      '中央空调': roomSize * 400,
      '地暖': roomSize * 350,
      '新风系统': roomSize * 250,
      '全屋净水': 8000,
      '家庭影院': 15000,
      '智能安防': 5000
    };
    
    additionalFeatures.forEach(feature => {
      if (feature in additionalFeatureCosts) {
        additionalCost += additionalFeatureCosts[feature];
      } else {
        // 未知功能按平均值计算
        additionalCost += roomSize * 200;
      }
    });
    
    // 计算总预算
    const totalBudget = baseTotal + additionalCost;
    
    // 计算预算明细
    const breakdown = {
      '人工费': totalBudget * 0.25,
      '主材费': totalBudget * 0.45,
      '辅材费': totalBudget * 0.15,
      '设计费': totalBudget * 0.08,
      '管理费': totalBudget * 0.07
    };
    
    // 如果有附加功能，添加到明细中
    if (additionalCost > 0) {
      breakdown['附加功能费'] = additionalCost;
    }
    
    // 估算工期
    let timeframe = '';
    if (roomSize <= 60) {
      timeframe = renovationScope === 'full' ? '约45-60天' : '约30-45天';
    } else if (roomSize <= 100) {
      timeframe = renovationScope === 'full' ? '约60-75天' : '约45-60天';
    } else if (roomSize <= 150) {
      timeframe = renovationScope === 'full' ? '约75-90天' : '约60-75天';
    } else {
      timeframe = renovationScope === 'full' ? '约90-120天' : '约75-90天';
    }
    
    // 根据材料质量和预算提供建议
    const recommendations = [];
    
    // 读取材料数据
    const materialsData = readMaterialsData();
    const materials = materialsData.materials || [];
    
    // 根据材料质量筛选推荐
    const qualityMap = {
      'high': 'high',
      'medium': 'medium',
      'budget': 'budget'
    };
    
    // 添加材料推荐
    if (materials.length > 0) {
      // 地板推荐
      const floorMaterials = materials.find(m => m.category === '地板')?.items || [];
      if (floorMaterials.length > 0) {
        const recommendedFloor = floorMaterials.find(m => 
          m.priceRange[qualityMap[materialQuality]]
        );
        if (recommendedFloor) {
          recommendations.push(`地板推荐：${recommendedFloor.name}，${recommendedFloor.description}，价格范围：${recommendedFloor.priceRange[qualityMap[materialQuality]]}`);
        }
      }
      
      // 墙面推荐
      const wallMaterials = materials.find(m => m.category === '墙面')?.items || [];
      if (wallMaterials.length > 0) {
        const recommendedWall = wallMaterials.find(m => 
          m.priceRange[qualityMap[materialQuality]]
        );
        if (recommendedWall) {
          recommendations.push(`墙面推荐：${recommendedWall.name}，${recommendedWall.description}，价格范围：${recommendedWall.priceRange[qualityMap[materialQuality]]}`);
        }
      }
    }
    
    // 添加一般性建议
    if (materialQuality === 'high') {
      recommendations.push('建议选择知名品牌的材料和设备，确保品质和售后服务');
      recommendations.push('可考虑聘请专业设计师进行个性化设计，提升空间品质');
    } else if (materialQuality === 'medium') {
      recommendations.push('建议在厨卫等重要功能区域选择质量更好的材料，其他区域可适当节省');
      recommendations.push('可以选择部分知名品牌的产品，部分选择性价比高的品牌');
    } else {
      recommendations.push('建议优先保证基础工程质量，表面装饰可以简化处理');
      recommendations.push('选择性价比高的材料，避免过度装修');
    }
    
    // 根据城市添加建议
    if (firstTierCities.some(city => location.includes(city))) {
      recommendations.push(`${location}装修价格较高，建议货比三家，选择性价比高的装修公司`);
    }
    
    return {
      totalBudget: Math.round(totalBudget),
      breakdown: Object.fromEntries(
        Object.entries(breakdown).map(([key, value]) => [key, Math.round(value)])
      ),
      estimatedTimeframe: timeframe,
      recommendations
    };
  }
});

// 材料价格查询工具
export const materialPriceTool = createTool({
  id: 'queryMaterialPrice',
  description: '查询装修材料的价格范围和特性',
  inputSchema: z.object({
    category: z.string().optional().describe('材料类别，如"地板"、"墙面"、"厨房"等'),
    materialName: z.string().optional().describe('材料名称，如"实木地板"、"乳胶漆"等'),
    priceLevel: z.enum(['budget', 'medium', 'high']).optional().describe('价格等级：经济型(budget)、中档(medium)、高端(high)')
  }),
  outputSchema: z.object({
    materials: z.array(
      z.object({
        name: z.string(),
        category: z.string(),
        description: z.string(),
        priceRange: z.object({
          budget: z.string().optional(),
          medium: z.string().optional(),
          high: z.string().optional()
        }),
        durability: z.string().optional(),
        maintenance: z.string().optional(),
        environmentalImpact: z.string().optional()
      })
    ),
    message: z.string()
  }),
  execute: async ({ context }) => {
    const { category, materialName, priceLevel } = context;
    
    // 读取材料数据
    const data = readMaterialsData();
    const categories = data.materials || [];
    
    let results = [];
    
    // 处理所有材料
    categories.forEach(cat => {
      const items = cat.items || [];
      
      items.forEach(item => {
        // 检查是否符合筛选条件
        const matchesCategory = !category || cat.category.toLowerCase().includes(category.toLowerCase());
        const matchesName = !materialName || item.name.toLowerCase().includes(materialName.toLowerCase());
        const matchesPriceLevel = !priceLevel || (item.priceRange && item.priceRange[priceLevel]);
        
        if (matchesCategory && matchesName && matchesPriceLevel) {
          results.push({
            name: item.name,
            category: cat.category,
            description: item.description,
            priceRange: item.priceRange,
            durability: item.durability,
            maintenance: item.maintenance,
            environmentalImpact: item.environmentalImpact
          });
        }
      });
    });
    
    return {
      materials: results,
      message: results.length > 0 
        ? `找到${results.length}种符合条件的材料。` 
        : '没有找到符合条件的材料。'
    };
  }
});

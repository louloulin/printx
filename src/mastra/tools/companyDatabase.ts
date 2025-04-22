import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

// 读取公司数据
const readCompaniesData = () => {
  try {
    const dataPath = path.join(process.cwd(), 'src/data/companies.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading companies data:', error);
    return { companies: [] };
  }
};

// 公司查询工具
export const companyDatabaseTool = createTool({
  id: 'queryCompanyDatabase',
  description: '查询装修公司数据库，根据位置、专业领域、价格范围等条件筛选装修公司',
  inputSchema: z.object({
    location: z.string().optional().describe('城市名称，如"北京"、"上海"等'),
    specialization: z.string().optional().describe('专业领域，如"全屋装修"、"厨房"、"卫生间"等'),
    priceRange: z.string().optional().describe('价格范围，如"高端"、"中高端"、"中端"等'),
    minRating: z.number().optional().describe('最低评分，1-5之间的数字'),
    limit: z.number().optional().default(5).describe('返回结果数量限制')
  }),
  outputSchema: z.object({
    companies: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        location: z.string(),
        specializations: z.array(z.string()),
        priceRange: z.string(),
        yearsInBusiness: z.number(),
        certifications: z.array(z.string()),
        contactInfo: z.object({
          phone: z.string(),
          email: z.string(),
          website: z.string()
        }),
        rating: z.number(),
        reviewCount: z.number()
      })
    ),
    totalResults: z.number(),
    message: z.string()
  }),
  execute: async ({ context }) => {
    const { location, specialization, priceRange, minRating, limit } = context;
    
    // 读取公司数据
    const data = readCompaniesData();
    let companies = data.companies || [];
    
    // 应用筛选条件
    if (location) {
      companies = companies.filter(company => 
        company.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (specialization) {
      companies = companies.filter(company => 
        company.specializations.some(spec => 
          spec.toLowerCase().includes(specialization.toLowerCase())
        )
      );
    }
    
    if (priceRange) {
      companies = companies.filter(company => 
        company.priceRange.toLowerCase().includes(priceRange.toLowerCase())
      );
    }
    
    if (minRating) {
      companies = companies.filter(company => company.rating >= minRating);
    }
    
    // 限制结果数量
    const limitedResults = companies.slice(0, limit || 5);
    
    return {
      companies: limitedResults,
      totalResults: companies.length,
      message: limitedResults.length > 0 
        ? `找到${companies.length}家符合条件的装修公司，显示前${limitedResults.length}家。` 
        : '没有找到符合条件的装修公司。'
    };
  }
});

// 公司评价工具
export const companyReviewTool = createTool({
  id: 'getCompanyReviews',
  description: '获取特定装修公司的详细评价信息',
  inputSchema: z.object({
    companyId: z.string().describe('公司ID'),
    companyName: z.string().optional().describe('公司名称（如果不知道ID）')
  }),
  outputSchema: z.object({
    companyInfo: z.object({
      id: z.string(),
      name: z.string(),
      location: z.string(),
      rating: z.number(),
      reviewCount: z.number(),
      priceRange: z.string()
    }),
    reviewSummary: z.object({
      positivePoints: z.array(z.string()),
      negativePoints: z.array(z.string()),
      overallImpression: z.string()
    }),
    message: z.string()
  }),
  execute: async ({ context }) => {
    const { companyId, companyName } = context;
    
    // 读取公司数据
    const data = readCompaniesData();
    const companies = data.companies || [];
    
    // 查找公司
    let company;
    if (companyId) {
      company = companies.find(c => c.id === companyId);
    } else if (companyName) {
      company = companies.find(c => 
        c.name.toLowerCase().includes(companyName.toLowerCase())
      );
    }
    
    if (!company) {
      return {
        companyInfo: {
          id: '',
          name: companyName || '',
          location: '',
          rating: 0,
          reviewCount: 0,
          priceRange: ''
        },
        reviewSummary: {
          positivePoints: [],
          negativePoints: [],
          overallImpression: ''
        },
        message: '未找到该公司信息。'
      };
    }
    
    // 生成模拟评价数据（在实际应用中，这部分应该从真实数据库获取）
    const positivePoints = [
      '设计方案创新，符合业主需求',
      '施工质量有保障，工艺精细',
      '服务态度好，沟通顺畅',
      '材料选择环保，品质可靠',
      '施工进度按计划进行，不拖延'
    ];
    
    const negativePoints = [
      '价格相对较高',
      '部分细节处理不够完美',
      '售后响应速度有待提高',
      '个别工人专业素养不够高',
      '设计方案修改次数有限制'
    ];
    
    // 根据评分筛选评价点
    const filteredPositive = positivePoints.slice(0, Math.ceil(company.rating / 5 * positivePoints.length));
    const filteredNegative = negativePoints.slice(0, Math.ceil((5 - company.rating) / 5 * negativePoints.length));
    
    // 生成整体印象
    let overallImpression = '';
    if (company.rating >= 4.5) {
      overallImpression = '该公司是当地知名度高、口碑极佳的装修公司，以高品质施工和优质服务著称。';
    } else if (company.rating >= 4.0) {
      overallImpression = '该公司整体表现良好，是值得信赖的装修公司，性价比较高。';
    } else if (company.rating >= 3.5) {
      overallImpression = '该公司服务质量中上，有一定优势，但也存在一些需要改进的地方。';
    } else {
      overallImpression = '该公司评价一般，建议在选择前做更多调研和比较。';
    }
    
    return {
      companyInfo: {
        id: company.id,
        name: company.name,
        location: company.location,
        rating: company.rating,
        reviewCount: company.reviewCount,
        priceRange: company.priceRange
      },
      reviewSummary: {
        positivePoints: filteredPositive,
        negativePoints: filteredNegative,
        overallImpression
      },
      message: `成功获取${company.name}的评价信息。`
    };
  }
});

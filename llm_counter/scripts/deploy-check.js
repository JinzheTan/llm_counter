#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 验证所有必要的文件和配置是否正确
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 开始部署前检查...\n');

const checks = [];

// 检查必要文件
const requiredFiles = [
  'package.json',
  'next.config.mjs',
  'vercel.json',
  'app/layout.tsx',
  'app/page.tsx',
  'lib/models.ts',
  'components/llm-word-counter.tsx',
  'app/api/llm-count/route.ts',
  'app/api/generate-article/route.ts',
  'app/api/crawl-article/route.ts'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    checks.push({ name: `文件存在: ${file}`, status: 'pass' });
  } else {
    checks.push({ name: `文件存在: ${file}`, status: 'fail' });
  }
});

// 检查环境变量示例
const envExample = `# Required for OpenAI models
OPENAI_API_KEY=your_openai_api_key_here`;

if (!fs.existsSync('.env.local')) {
  checks.push({ name: '.env.local 文件', status: 'warn', message: '需要创建 .env.local 文件' });
  console.log('📝 创建 .env.local 示例文件...');
  fs.writeFileSync('.env.local.example', envExample);
}

// 检查 package.json 中的依赖
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDependencies = ['ai', '@ai-sdk/openai', 'next', 'react'];

requiredDependencies.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    checks.push({ name: `依赖: ${dep}`, status: 'pass' });
  } else {
    checks.push({ name: `依赖: ${dep}`, status: 'fail' });
  }
});

// 检查 API 路由配置
const apiRoutes = [
  'app/api/llm-count/route.ts',
  'app/api/generate-article/route.ts',
  'app/api/crawl-article/route.ts'
];

apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    const content = fs.readFileSync(route, 'utf8');
    if (content.includes('corsHeaders')) {
      checks.push({ name: `CORS配置: ${route}`, status: 'pass' });
    } else {
      checks.push({ name: `CORS配置: ${route}`, status: 'warn' });
    }
  }
});

// 输出检查结果
console.log('📋 检查结果:\n');

let hasErrors = false;
let hasWarnings = false;

checks.forEach(check => {
  const icons = {
    pass: '✅',
    fail: '❌',
    warn: '⚠️'
  };
  
  console.log(`${icons[check.status]} ${check.name}`);
  if (check.message) {
    console.log(`   ${check.message}`);
  }
  
  if (check.status === 'fail') hasErrors = true;
  if (check.status === 'warn') hasWarnings = true;
});

console.log('\n🎯 部署建议:');
console.log('1. 确保在 Vercel 中设置 OPENAI_API_KEY 环境变量');
console.log('2. 选择 llm_counter 文件夹作为根目录');
console.log('3. 确保 OpenAI API 密钥有足够的配额');
console.log('4. 部署后测试所有功能');

if (hasErrors) {
  console.log('\n❌ 发现错误，请修复后再部署');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️ 发现警告，建议检查但可以继续部署');
} else {
  console.log('\n✅ 所有检查通过，可以部署！');
}

console.log('\n🚀 部署命令: vercel');
console.log('📖 详细说明: 查看 DEPLOYMENT.md'); 
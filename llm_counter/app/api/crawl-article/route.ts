import { NextResponse } from 'next/server';

// 添加CORS头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

const sampleArticles = [
  {
    title: "The Art of Machine Learning",
    content: `Machine learning has revolutionized the way we approach complex problems in technology. The field of machine learning encompasses various algorithms and techniques that enable computers to learn from data without being explicitly programmed.

Deep learning, a subset of machine learning, has shown remarkable success in areas such as image recognition, natural language processing, and speech recognition. Neural networks, the backbone of deep learning, consist of interconnected nodes that process information in layers.

The applications of machine learning are vast and growing. From recommendation systems in streaming platforms to autonomous vehicles, machine learning algorithms are becoming integral to our daily lives. Companies worldwide are investing heavily in machine learning research and development.

One of the key challenges in machine learning is ensuring that models can generalize well to new, unseen data. This requires careful consideration of training data quality, feature selection, and model validation techniques.

As we move forward, the field of machine learning continues to evolve rapidly. New architectures, optimization techniques, and applications emerge regularly, pushing the boundaries of what's possible with artificial intelligence.`
  },
  {
    title: "Climate Change and Renewable Energy",
    content: `Climate change represents one of the most pressing challenges of our time. Rising global temperatures, melting ice caps, and extreme weather events are clear indicators that our planet's climate system is changing rapidly.

Renewable energy sources offer a promising solution to reduce greenhouse gas emissions. Solar energy, wind energy, and hydroelectric power are becoming increasingly cost-effective alternatives to fossil fuels. Solar panels have become more efficient and affordable, making solar energy accessible to both residential and commercial users.

Wind energy has experienced tremendous growth in recent years. Modern wind turbines can generate substantial amounts of electricity, and offshore wind farms are expanding the potential for wind energy production. The technology continues to improve, with larger turbines and better energy storage solutions.

Energy storage is crucial for renewable energy adoption. Battery technology has advanced significantly, enabling better storage of energy generated from intermittent sources like solar and wind. Grid-scale storage solutions are becoming more viable and cost-effective.

The transition to renewable energy requires coordinated efforts from governments, businesses, and individuals. Policy support, technological innovation, and public awareness all play important roles in accelerating the adoption of clean energy solutions.`
  },
  {
    title: "The Future of Space Exploration",
    content: `Space exploration has captured human imagination for decades, and recent developments suggest an exciting future for space travel and discovery. Private companies are now playing crucial roles alongside government space agencies in advancing space technology.

Mars exploration remains a primary focus for many space agencies. Robotic missions have provided valuable data about the Red Planet's geology, atmosphere, and potential for past or present life. Plans for human missions to Mars are becoming more concrete, with various agencies targeting the 2030s for crewed missions.

The Moon has regained attention as a stepping stone for deeper space exploration. Lunar missions are planned to establish permanent bases that could serve as launch points for missions to Mars and beyond. The Moon's resources, particularly water ice, could be crucial for future space missions.

Commercial space companies have transformed the space industry. Reusable rockets have significantly reduced launch costs, making space more accessible for various applications including satellite deployment, space tourism, and scientific research.

Space technology continues to benefit life on Earth. Satellite technology enables global communications, weather monitoring, GPS navigation, and Earth observation for environmental monitoring. The innovations developed for space missions often find applications in terrestrial technologies, contributing to advances in materials science, medicine, and engineering.`
  }
];

export async function GET() {
  try {
    // Select a random article from the sample articles
    const randomIndex = Math.floor(Math.random() * sampleArticles.length);
    const selectedArticle = sampleArticles[randomIndex];
    
    // Format the article with title and content
    const article = `${selectedArticle.title}\n\n${selectedArticle.content}`;
    
    return NextResponse.json({ 
      article,
      source: 'sample',
      title: selectedArticle.title 
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error getting sample article:', error);
    return NextResponse.json(
      { error: 'Failed to get sample article' },
      { status: 500, headers: corsHeaders }
    );
  }
}

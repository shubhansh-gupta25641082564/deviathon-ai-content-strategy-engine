// Popular creators database organized by platform and content type
export const CREATORS_DATABASE = {
    YouTube: {
        tech: [
            { name: "Fireship", followers: "2.8M", specialty: "Quick Tech Tutorials", verified: true, avatar: "🔥" },
            { name: "Web Dev Simplified", followers: "1.2M", specialty: "Web Development", verified: true, avatar: "💻" },
            { name: "Coding with Lewis", followers: "800K", specialty: "Full Stack Development", verified: true, avatar: "👨‍💻" },
            { name: "JavaScript Mastery", followers: "1.5M", specialty: "Modern JavaScript", verified: true, avatar: "⚡" },
            { name: "Kevin Powell", followers: "900K", specialty: "CSS & Design", verified: true, avatar: "🎨" },
            { name: "Traversy Media", followers: "2.1M", specialty: "Programming Tutorials", verified: true, avatar: "📚" },
            { name: "The Net Ninja", followers: "1.8M", specialty: "Web Development", verified: true, avatar: "🥷" },
            { name: "Programming with Mosh", followers: "3.2M", specialty: "Programming Fundamentals", verified: true, avatar: "🚀" }
        ],
        ai: [
            { name: "Two Minute Papers", followers: "1.4M", specialty: "AI Research", verified: true, avatar: "🤖" },
            { name: "Yannic Kilcher", followers: "280K", specialty: "Machine Learning", verified: true, avatar: "🧠" },
            { name: "3Blue1Brown", followers: "5.2M", specialty: "Math & AI Concepts", verified: true, avatar: "🔷" },
            { name: "Sentdex", followers: "1.1M", specialty: "Python & AI", verified: true, avatar: "🐍" }
        ]
    },
    Reddit: {
        programming: [
            { name: "u/gfx-rs", followers: "45K karma", specialty: "Rust Development", verified: false, avatar: "🦀" },
            { name: "u/acmesomecorp", followers: "78K karma", specialty: "System Design", verified: false, avatar: "⚙️" },
            { name: "u/webdev_pro", followers: "92K karma", specialty: "Frontend Tips", verified: false, avatar: "🌐" },
            { name: "u/python_guru", followers: "156K karma", specialty: "Python Best Practices", verified: false, avatar: "🐍" }
        ],
        technology: [
            { name: "u/tech_insider", followers: "234K karma", specialty: "Tech News Analysis", verified: false, avatar: "📱" },
            { name: "u/future_tech", followers: "189K karma", specialty: "Emerging Technologies", verified: false, avatar: "🔮" },
            { name: "u/security_expert", followers: "167K karma", specialty: "Cybersecurity", verified: false, avatar: "🔒" }
        ]
    },
    Instagram: {
        tech: [
            { name: "@tech.with.tim", followers: "450K", specialty: "Programming Tips", verified: true, avatar: "👨‍💻" },
            { name: "@codewithlove", followers: "320K", specialty: "Web Development", verified: true, avatar: "💖" },
            { name: "@designcode", followers: "890K", specialty: "UI/UX Design", verified: true, avatar: "🎨" },
            { name: "@theprogrammingfactory", followers: "275K", specialty: "Code Tutorials", verified: true, avatar: "🏭" },
            { name: "@frontend.joe", followers: "180K", specialty: "Frontend Development", verified: true, avatar: "⚡" }
        ]
    },
    News: {
        tech: [
            { name: "TechCrunch", followers: "9.2M", specialty: "Startup News", verified: true, avatar: "📰" },
            { name: "The Verge", followers: "3.8M", specialty: "Consumer Tech", verified: true, avatar: "🔺" },
            { name: "Ars Technica", followers: "1.2M", specialty: "Deep Tech Analysis", verified: true, avatar: "🔬" },
            { name: "Wired", followers: "15.1M", specialty: "Future Technology", verified: true, avatar: "🌐" },
            { name: "Hacker News", followers: "500K", specialty: "Developer Community", verified: true, avatar: "🍊" }
        ]
    },
    Trends: {
        tech: [
            { name: "Google Trends", followers: "Official", specialty: "Search Trends", verified: true, avatar: "📊" },
            { name: "Tech Trend Analysis", followers: "2.1M", specialty: "Market Analysis", verified: true, avatar: "📈" },
            { name: "Future Tech Insights", followers: "850K", specialty: "Emerging Trends", verified: true, avatar: "🔮" },
            { name: "Digital Innovation Hub", followers: "1.3M", specialty: "Innovation Tracking", verified: true, avatar: "💡" }
        ]
    }
};

// Function to get relevant creators based on platform and content type
export function getRelevantCreators(platform, contentType = 'tech', count = 3) {
    const platformCreators = CREATORS_DATABASE[platform];
    if (!platformCreators) return [];

    const creators = platformCreators[contentType] || platformCreators.tech || [];
    
    // Shuffle and return requested number of creators
    const shuffled = [...creators].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Function to get a random popular creator for any platform
export function getRandomCreator(platform) {
    const platformCreators = CREATORS_DATABASE[platform];
    if (!platformCreators) return null;

    const allCreators = Object.values(platformCreators).flat();
    return allCreators[Math.floor(Math.random() * allCreators.length)];
}

// Function to get trending creators across all platforms
export function getTrendingCreators(count = 5) {
    const allCreators = Object.values(CREATORS_DATABASE)
        .map(platform => Object.values(platform).flat())
        .flat()
        .filter(creator => creator.verified)
        .sort(() => 0.5 - Math.random());
    
    return allCreators.slice(0, count);
}

// Function to analyze content and suggest relevant creators
export function suggestCreatorsForContent(content, platform) {
    const keywords = content.toLowerCase();
    
    // Define content categories and their keywords
    const categories = {
        ai: ['ai', 'artificial intelligence', 'machine learning', 'neural', 'deep learning', 'gpt'],
        frontend: ['react', 'vue', 'angular', 'css', 'html', 'frontend', 'ui', 'ux'],
        backend: ['node', 'python', 'java', 'backend', 'server', 'database', 'api'],
        mobile: ['react native', 'flutter', 'ios', 'android', 'mobile'],
        devops: ['docker', 'kubernetes', 'aws', 'cloud', 'devops', 'deployment'],
        security: ['security', 'cybersecurity', 'encryption', 'auth', 'vulnerability']
    };
    
    // Find matching category
    let matchedCategory = 'tech'; // default
    for (const [category, categoryKeywords] of Object.entries(categories)) {
        if (categoryKeywords.some(keyword => keywords.includes(keyword))) {
            matchedCategory = category;
            break;
        }
    }
    
    return getRelevantCreators(platform, matchedCategory, 2);
}
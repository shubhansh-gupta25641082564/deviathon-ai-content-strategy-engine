// Strategy generators for different content types
export const generateContentIdeas = async (topic) => {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const ideas = {
        'technology': [
            "The Future of AI in Content Creation: 2025 Perspective",
            "How Quantum Computing is Reshaping Digital Marketing",
            "5G Technology: Impact on Content Consumption",
            "Cybersecurity Best Practices for Content Creators",
            "Emerging Tech Trends That Will Transform Your Content Strategy"
        ],
        'marketing': [
            "Data-Driven Content Marketing Strategies for 2025",
            "Personalization at Scale: The New Content Paradigm",
            "Social Media Algorithms: Staying Ahead of the Game",
            "Video Marketing Trends That Drive Engagement",
            "Building a Multi-Channel Content Distribution Strategy"
        ],
        'business': [
            "Remote Work Culture: Content Strategies That Connect",
            "B2B Content Marketing: What Works in 2025",
            "ROI Measurement in Content Marketing",
            "Content Automation: Tools and Techniques",
            "Building a Strong Brand Voice Through Content"
        ],
        'default': [
            "How to Create Engaging Content That Converts",
            "Content Strategy Tips for Better Audience Engagement",
            "Measuring Content Performance: Key Metrics to Track",
            "Content Creation Tools and Resources for 2025",
            "Building a Content Calendar That Works"
        ]
    };

    return ideas[topic] || ideas.default;
};

export const generateContentCalendar = async (month = 'current') => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        week1: {
            monday: {
                task: "Blog Post: Industry Trends Analysis",
                platform: "Website Blog",
                time: "10:00 AM"
            },
            wednesday: {
                task: "Social Media Campaign Launch",
                platform: "All Social Channels",
                time: "2:00 PM"
            },
            friday: {
                task: "Video Content: How-to Guide",
                platform: "YouTube/Instagram",
                time: "3:00 PM"
            }
        },
        week2: {
            tuesday: {
                task: "Newsletter Distribution",
                platform: "Email",
                time: "9:00 AM"
            },
            thursday: {
                task: "Podcast Episode Release",
                platform: "Spotify/Apple Podcasts",
                time: "11:00 AM"
            },
            saturday: {
                task: "Live Q&A Session",
                platform: "Instagram Live",
                time: "5:00 PM"
            }
        }
    };
};

export const generateSEOStrategy = async (industry) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const strategies = {
        'technology': [
            "Implement schema markup for tech products",
            "Focus on technical documentation SEO",
            "Optimize for voice search queries",
            "Create developer-focused content",
            "Build authority through technical guides"
        ],
        'marketing': [
            "Target long-tail marketing keywords",
            "Create comprehensive marketing guides",
            "Optimize for local SEO",
            "Focus on case study content",
            "Build industry-specific backlinks"
        ],
        'default': [
            "Conduct thorough keyword research",
            "Optimize meta descriptions and title tags",
            "Create comprehensive pillar content",
            "Improve website loading speed",
            "Build quality backlinks through outreach",
            "Implement mobile-first optimization"
        ]
    };

    return strategies[industry] || strategies.default;
};
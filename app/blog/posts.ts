export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

export const posts: BlogPost[] = [
  {
    slug: 'building-my-website-with-ai',
    title: 'Building My Personal Website with AI: A Multi-Model Workflow',
    excerpt: 'How I built a professional website in one session using Claude Code, ChatGPT, and strategic prompting—without writing a single line of code myself.',
    date: '2026-02-08',
    readTime: '10 min read',
    category: 'AI & Building',
    content: `
Last week I set out to rebuild my personal website. What would have traditionally taken weeks of back-and-forth with a developer—or months of learning to code myself—took one focused session. The result is what you're looking at right now.

This post isn't about the website. It's about the workflow: how I used multiple AI tools together, learned to prompt effectively on the fly, and discovered that the biggest barrier for non-technical builders isn't the technology—it's just getting started.

## The Approach: Treating AI as a Creative Collaborator

I didn't start with a design in mind. I started with a reference.

Instead of trying to describe what I wanted, I found a website I admired and asked Claude to review it. I gave it a link to a site showcasing modern design aesthetics and asked it to analyze what made the design effective—the color palettes, typography choices, layout patterns, and interactive elements.

This changed everything. Rather than me fumbling to articulate "I want it to feel professional but not corporate," Claude extracted the design principles from real examples. Dark backgrounds with earthy accent colors. Subtle scroll animations. Glass-effect navigation. Gradient overlays on images.

### The Power of Reference-Based Prompting

Here's what I learned: AI tools are dramatically more effective when you give them something concrete to work from. Instead of abstract descriptions, give them:
- **Examples**: "Look at how this site handles the hero section"
- **Constraints**: "Use only these three colors"
- **Comparisons**: "Make it feel more like X and less like Y"

The AI went from generic suggestions to highly specific implementations that matched my taste—because I had shown it my taste rather than trying to describe it.

## Working Across Models: Playing to Strengths

Here's where it gets interesting. While Claude was building the website, I realized I needed a logo. Claude is exceptional at code and reasoning, but I wanted to explore visual concepts. So I switched to ChatGPT with its image generation capabilities.

I described what I was looking for—something that represented my military background (a shield) combined with forward momentum (an ascending arrow). After a few iterations, I had concepts I liked. Then I used another tool to convert the image into clean SVG code, which I brought back to Claude to integrate into the site.

This multi-model workflow felt natural once I stopped expecting one tool to do everything.

### AI Model Strengths: A Practical Comparison

Based on this project and others, here's how I think about different models:

[MODEL] Claude (Code / Opus) | Best for **code generation** and **complex reasoning**. Exceptional at maintaining context across long sessions. Writes clean, well-structured code. Watch out for verbosity—sometimes needs explicit constraints.

[MODEL] ChatGPT (GPT-4) | Best for **brainstorming** and **image generation**. DALL-E integration is great for visual concepts. Good at rapid creative iteration. Can lose context in long conversations.

[MODEL] Specialized Tools (Cursor, v0) | Best for **specific workflows** they're designed for. Optimized UX means faster results for their intended use case. Less flexible outside their core purpose.

The key insight: don't be loyal to one tool. Use the right model for each task and move outputs between them freely.

## The Real-Time Iteration Loop

What surprised me most was the speed of iteration. In a traditional development process, each change request means waiting—for a developer to find time, understand the request, implement it, and deploy it.

With Claude Code, the loop collapsed to seconds.

- **"The name should be all gradient, not just the first name"** → Done in 20 seconds
- **"Can you make the Affirm tile purple to match their brand?"** → Done
- **"I added a King Air image to the folder, use that for the Army section"** → Updated immediately

This isn't just faster—it's a fundamentally different creative process. When iteration is instant, you explore more options. You try things you wouldn't have bothered requesting from a developer. The gap between imagining something and seeing it shrinks to almost nothing.

### The Favicon Debugging Saga

Not everything was smooth. At one point, I couldn't get my custom logo to show up as the browser favicon. We tried multiple approaches—different file formats, different locations, clearing caches, incognito mode.

The problem? There was an old icon file in a directory that was overriding the new one. Classic development debugging—but with AI, even the troubleshooting was collaborative. Claude methodically worked through possibilities, explained what each attempt was testing, and eventually identified the conflict.

This is the part that would have frustrated me to no end if I were trying to learn coding on my own. With AI, debugging becomes a conversation rather than a solo struggle through Stack Overflow.

## Getting Started: GitHub and the Intimidation Factor

I want to address something that almost stopped me before I started: GitHub.

If you've never used version control, GitHub can feel intimidating. Branches, commits, pull requests—it sounds like a foreign language. I nearly decided to "just make changes directly" and skip the whole thing.

I'm glad I didn't. Here's why it matters:

- **Safety net**: Every change is tracked. If something breaks, you can always go back
- **Clean workflow**: Working in branches means you can experiment without fear
- **Professional practice**: If you ever work with developers, this is how they work

Claude walked me through the workflow: create a branch, make changes, commit with a message, push, create a pull request. After doing it twice, it felt natural. The intimidation was entirely in my head.

For any non-technical builder reading this: don't skip the fundamentals. The twenty minutes you spend learning basic Git workflow will pay dividends across every project.

## The Speed of Progress

Let me put concrete numbers on this.

In roughly two hours of focused work, I went from a blank template to a fully-designed personal website with:
- Custom dark theme with earthy color palette
- Animated sections with scroll-triggered effects
- Branded experience tiles matching company aesthetics
- Integrated custom logo and headshot
- Responsive design for mobile and desktop
- Two complete pages (home and about) with consistent styling
- A blog with this post you're reading

Two hours. And I don't know how to code.

This is the part that feels important to emphasize. The technology has reached a point where the bottleneck isn't capability—it's imagination and clear communication. If you can describe what you want, you can build it.

## The Bottom Line

Building with AI isn't about replacing developers or learning to code. It's about having a new kind of creative partner—one that can translate your vision into reality at the speed of conversation.

The workflow that worked for me: start with references, use the right model for each task, iterate rapidly, and don't be afraid of the developer tools that seemed intimidating at first glance.

If you're a non-technical leader wondering whether you should invest time in learning these tools: yes. Absolutely yes. The hour you spend building something real will teach you more than any article (including this one).

Just start. The tools are waiting.
    `,
  },
  {
    slug: 'non-technical-execs-ai-revolution',
    title: 'Why Non-Technical Executives Must Learn to Leverage AI Tools Like Claude Code',
    excerpt: 'The executives who will thrive in the next decade aren\'t waiting for IT to hand them solutions. They\'re learning to wield AI themselves—and the gap between those who do and those who don\'t is widening fast.',
    date: '2026-02-01',
    readTime: '8 min read',
    category: 'Leadership',
    content: `
I built this website in an afternoon. Not by hiring a developer. Not by learning to code over months of tutorials. I did it by having a conversation with Claude Code—an AI assistant that translated my vision into reality while I focused on what I actually wanted to communicate.

A year ago, this would have required a developer, a designer, and weeks of back-and-forth. Today, it required curiosity and a willingness to learn a new way of working.

This isn't a story about websites. It's about a fundamental shift in what's possible for non-technical leaders—and why getting invested in these tools now isn't optional.

## The Widening Gap

Every week I talk to executives who fall into one of two camps.

The first group is experimenting. They're using AI to draft communications, analyze data, prototype ideas, and automate the tedious parts of their work. They're not experts—they're learners. But they're building an intuition for what's possible.

The second group is waiting. Waiting for IT to roll out an "approved" solution. Waiting for the technology to "mature." Waiting for someone to tell them it's safe.

Here's what the second group doesn't realize: the gap between these two camps is compounding daily. The executives who are experimenting aren't just saving time—they're developing a fundamentally different mental model of what's possible. They're asking different questions. Seeing different opportunities. Making different decisions.

By the time the "approved" solutions arrive, the first group will be operating on an entirely different level.

## Why This Moment Is Different

We've been through technology shifts before. The internet. Mobile. Cloud. Social. Each one required executives to adapt. But this shift is different in a crucial way.

Previous technology waves required you to understand what the technology could do and then direct others to build it. You needed technical literacy, not technical capability.

AI tools like Claude Code collapse that gap. For the first time, non-technical leaders can directly create, prototype, and build—not by becoming programmers, but by becoming effective collaborators with AI systems.

The skill isn't coding. The skill is:
- **Clear communication**: Knowing how to articulate what you want
- **Iterative thinking**: Building in small steps, testing, and refining
- **Creative direction**: Recognizing when output matches your vision

These are skills most executives already have. They just need to apply them in a new context.

## What Getting Invested Actually Looks Like

I'm not suggesting every COO needs to build their own website. But I am suggesting that every executive needs hands-on experience with these tools. Not a demo. Not a presentation from a vendor. Actual, hands-on experience.

Here's why: you cannot evaluate opportunities you don't understand. You cannot ask the right questions about AI strategy if you've never felt the difference between a well-crafted prompt and a poor one. You cannot lead an organization through this transition if you're relying entirely on others to interpret what's possible.

### Start Small, But Start

Pick something real but low-stakes:
- Use Claude to analyze a quarterly report and surface insights you might have missed
- Have an AI tool help you draft a difficult communication, then refine it together
- Prototype a simple tool or workflow that would make your team more efficient
- Build something tangible—even if it's just for yourself

The goal isn't to become technical. The goal is to develop intuition.

### Embrace the Learning Curve

The first time you use these tools, you'll probably be underwhelmed. Your prompts will be vague. The outputs will be generic. You'll wonder what all the hype is about.

This is exactly what happened with previous technology shifts. Remember the first time you tried to find something on the early internet? Or sent your first email? The tools felt clunky and limited—until you developed fluency.

The executives who push through that initial friction are the ones who discover the real potential.

### Build Organizational Muscle

Once you've developed personal fluency, the next step is building it across your organization. This doesn't mean mandating AI usage or rolling out enterprise tools. It means:
- **Creating psychological safety** for experimentation
- **Sharing learnings** from your own experiments
- **Celebrating creative applications** wherever they emerge
- **Asking better questions** about how AI could help with specific challenges

The organizations that will win aren't the ones with the best AI strategy decks. They're the ones where dozens of people are running small experiments, sharing what works, and building collective intelligence about how to leverage these tools.

## The Cost of Waiting

Let me be direct about what's at stake.

In every previous technology transition, there was a reasonable window to wait and see. You could let early adopters work out the kinks, then fast-follow with mature solutions.

That window is closing faster than any previous transition. The capabilities of these tools are improving monthly, not yearly. The executives who are experimenting now are building advantages that will compound.

Worse, the cost of waiting isn't just falling behind—it's losing the ability to catch up. Once your competitors have developed AI-native workflows, AI-enhanced decision-making, and AI-accelerated execution, the gap becomes structural.

## This Isn't About Technology

The deepest reason to get invested in AI tools isn't about technology at all. It's about leadership.

Your teams are watching how you respond to this shift. Are you curious or defensive? Engaged or delegating? Learning or waiting?

The executives who will thrive aren't the ones with the best technical understanding. They're the ones who model the mindset that will define the next decade: relentless curiosity, willingness to be a beginner, and the courage to engage with change rather than manage it from a distance.

The tools are ready. The question is whether you are.

## Where to Start

If you've read this far and you're convinced but unsure where to begin, here's my suggestion:

Pick one thing you've been meaning to do but haven't had time for. Something that would normally require help from a technical team. Maybe it's building a simple dashboard, creating a prototype, drafting a proposal, or analyzing a complex dataset.

Then spend an hour with Claude Code or a similar tool trying to make progress on it. Don't worry about doing it "right." Just experiment.

You'll learn more about what's possible—and what you need to learn—in that hour than in any presentation or strategy session.

The AI revolution isn't coming. It's here. The only question is whether you'll be leading it or following it.
    `,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

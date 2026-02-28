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
    slug: 'from-static-site-to-product',
    title: 'I Turned My Website Into a Product in One Day. Here\'s What That Means.',
    excerpt: 'A contact form that logs leads to a database. A comment section for readers. A private admin dashboard. All built without a developer — and what it signals about what\'s now possible for any operator.',
    date: '2026-02-28',
    readTime: '6 min read',
    category: 'AI & Building',
    content: `
Two days ago, this was a static website. Nice design, a couple of blog posts, a contact page that went nowhere.

Today it's a product.

When someone fills out the contact form, I get an email notification and their information is automatically saved to a database I can review anytime. When a reader finishes a post and wants to respond, there's a comment section at the bottom. When I want to see who has reached out or engaged, I log into a password-protected admin dashboard and it's all there.

I built all of it in one day. No developer. Using AI as my co-engineer and a handful of best-in-class tools to handle the infrastructure.

Here's what I want to talk about — not the technical how, but what this signals about what's now possible.

## What Actually Changed

The most important thing isn't what got built. It's that the decision to build required no delegation.

Before AI, the path from "I want a contact form that emails me and saves to a database" to an actual working product looked like this: write a brief, find a developer, schedule time, wait, review, revise, wait again. Three weeks minimum for a one-day problem.

With Claude Code as the co-engineer, that loop collapsed. I described what I wanted in plain English. It built it. I tested it, noticed things to change, said so, and it was updated. The whole thing — concept to deployed product — happened in a single session.

[CALLOUT] When the cost of building drops this far, the question changes. It stops being "should we build this?" and starts being "why haven't we built everything we've been putting off?"

## The Tools That Made It Possible

Four tools did the work. I want to name them because demystifying this is part of the point:

[MODEL] Claude Code | The AI co-engineer at the center of everything. I described what I wanted in plain language; it built working software and iterated with me in real time. This is the tool that changed the equation — it doesn't require you to speak code, just to think clearly about what you need.

[MODEL] Supabase | A database platform that stores contacts and comments automatically. Every form submission is logged. Free to start, nothing to manage. Think of it as a spreadsheet that lives on the internet and connects to everything else.

[MODEL] Resend | An email delivery service. Every contact form submission and comment triggers an instant notification to my inbox. I can reply directly — no logging into a dashboard, no digging through a database.

[MODEL] Vercel | Where the site lives. Every change I make goes live automatically. Zero servers, zero deployment process. It just works.

None of these required technical expertise to set up. What they required was knowing what I wanted and understanding which tool handles which job.

## The Business Translation

Let me say what was actually built in business terms.

In one day, I created:
- A **lead capture system** that logs every inquiry automatically — no more lost emails
- An **instant notification system** so nothing falls through the cracks
- A **reader engagement layer** that turns one-way content into actual conversations
- A **private admin interface** to see everything in one place

This is the foundation of a CRM. It's also the skeleton of a newsletter system, a pipeline tracker, or a client portal. The infrastructure is in place. What gets built next is a question of priorities, not resources.

[CALLOUT] Every operational tool your team has been "planning to build someday" is now a real conversation. The cost has changed. The timeline has changed. The calculus is different.

## What This Means for Operators

I spent twelve years in the Army learning that operational advantage comes from doing more with less — moving faster, deciding with better information, eliminating friction between intent and execution.

AI tools are the most significant operational leverage I've encountered since then. Not because they're impressive technology, but because they collapse the gap between what you can imagine and what you can actually build.

The companies I see moving fastest right now aren't necessarily the ones with the biggest engineering teams. They're the ones where curious operators are learning to direct AI tools effectively — building things in hours that used to take months.

That's a real competitive advantage. And it's available to any team willing to invest in developing it.

## The Question Worth Asking

What have you been putting off building because you didn't have the technical resources?

A reporting dashboard. A client onboarding workflow. An internal tool that would save your team hours every week. A product experiment you wanted to validate before committing to a full build.

These aren't hypothetical anymore. I work with companies to identify these opportunities and actually build them — both the tools themselves and the organizational capability to keep building. If you're curious what that looks like, reach out through the contact form or drop a comment below. What's the one thing you've been meaning to build?
    `,
  },
  {
    slug: 'building-my-website-with-ai',
    title: 'I Built This Website Without Writing Code. Here\'s What That Actually Felt Like.',
    excerpt: 'A non-coder goes from blank slate to live custom website in one afternoon using AI as a creative partner — and discovers something important about where the real bottleneck is.',
    date: '2026-02-08',
    readTime: '6 min read',
    category: 'AI & Building',
    content: `
I had been putting off rebuilding my personal website for months.

Not because I lacked ideas. Not because I didn't care about it. But because every path I could see required either weeks of learning to code or handing off creative control to a developer and going back and forth on revisions until everyone was exhausted.

Then I tried Claude Code. And I built the entire thing in an afternoon.

Not a template — a fully custom site with a dark design I described, color palettes I chose, animated sections, a logo concept I sketched in words, and a blog. Exactly what I had in my head. In a few hours.

I want to tell you what that felt like — not as a tech tutorial, but as a leader who suddenly understood something important about the world we're operating in.

## Start with a Reference, Not a Description

The first thing I did wasn't type a prompt. It was find a reference.

I found a website I admired and asked Claude to analyze it — what made the design feel premium, what layout choices created the sense of quality, what I could borrow. Then I described what I wanted: a darker palette, earthy tones, something that felt like a serious operator's site rather than a SaaS product page.

What came back was better than what I had described. Because I had shown it my taste instead of trying to articulate it.

[CALLOUT] You don't need to know what you want in technical terms. You need to know it when you see it. That's a skill every experienced leader already has.

## Three Tools, Each Doing One Job

I ended up using three tools on this project. None of them required technical expertise. Each one handled a different part of the work:

[MODEL] Claude Code | My primary builder. I described what I wanted in plain language, it built it, I gave feedback, it iterated. The conversation felt more like working with a skilled contractor than using a software tool. This is where the actual website was built.

[MODEL] ChatGPT | For visual ideation. I needed a logo concept — something representing my military background and forward momentum. I described it, got visual options back, reacted to them, refined. I didn't know I wanted a shield-and-arrow until I saw it. Then it was obviously right.

[MODEL] Vercel | Where the site lives. Every change I make goes live within seconds. No server management, no deployment process. I describe a change to Claude, it's built, it's live. The whole loop is under a minute.

Three tools, each doing what it does best. The thinking and judgment were mine.

## The Speed Changes the Process

The part that's hard to explain until you've experienced it: iteration at this speed is a different creative activity.

In a traditional process, every change request has a cost — a developer's time, a communication gap, a waiting period. That cost shapes what you ask for. You batch your requests. You accept things that are close enough.

With AI, I noticed something was off — the headline felt too corporate, the spacing was wrong, the color wasn't quite right — and said so. Twenty seconds later it was fixed. I tried things I wasn't sure about, and changed them just as fast if they didn't work.

[CALLOUT] When you can try anything in seconds, you explore more. You take creative risks you wouldn't take if each one cost hours of someone else's time. That's not just faster work — it's a fundamentally different creative process.

## The Bottleneck Moved

Here's the shift I keep coming back to.

For most of the last thirty years, the bottleneck between a leader's vision and something actually getting built was technical skill. You either had it or you hired it. Non-technical leaders learned to work within that constraint — to communicate clearly, to be patient, to accept some distance between what they imagined and what actually got built.

AI tools don't eliminate technical skill. But they compress the gap so dramatically that for many categories of work — tools, prototypes, content, dashboards — the constraint is no longer skill. It's clarity of thought.

[CALLOUT] If you can describe what you want, you can build it. That sentence didn't used to be true. It is now.

## What I'd Tell Other Leaders

Pick something small and real. Not a demo. Not a sandbox exercise. Something you actually want to exist.

Your first attempts will produce generic output. Push through it. Show the tool what you mean. Give feedback. Iterate. By the third or fourth round, something shifts — you stop thinking about the tool and start thinking about what you're building. That's when it becomes interesting.

What would you build if you could build anything? I'd love to hear it — drop a comment below. And if you want to think through how these tools apply to your specific work, reach out. That's exactly the kind of conversation I enjoy.
    `,
  },
  {
    slug: 'non-technical-execs-ai-revolution',
    title: 'The AI Experiments Every Executive Should Be Running Right Now',
    excerpt: 'The executives pulling ahead aren\'t waiting for IT to roll out an approved solution. They\'re experimenting themselves — and building an advantage that compounds every week.',
    date: '2026-02-01',
    readTime: '7 min read',
    category: 'Leadership',
    content: `
There are two kinds of executives I meet these days.

The first kind is experimenting. They've built something with AI — even something small. Maybe they used Claude to analyze a report and found a pattern their team had missed. Maybe they drafted a difficult communication in thirty minutes instead of three hours. Maybe they prototyped something that would have taken a developer six weeks to build.

The second kind is waiting. For IT to roll out an approved solution. For the technology to stabilize. For someone to give the green light.

Here's what the second group doesn't see: the first group isn't just saving time. They're developing a different mental model of what's possible. Asking different questions. Seeing different opportunities. Making different decisions.

And that gap compounds every week.

## Why This Moment Is Different

We've navigated technology shifts before. The internet. Mobile. The cloud. Each one required adaptation — new channels, new infrastructure, new ways of operating.

But every one of those waves required the same thing from non-technical leaders: understand what the technology can do, then direct others to build it.

This wave is different. For the first time, the doing and the thinking don't require separate people.

With tools like Claude Code, a COO can prototype an internal dashboard. A CMO can build a content system. A founder can turn a process they've been documenting for months into a working tool — in an afternoon. Not because they've become engineers, but because the gap between "I want something that does this" and "here is a thing that does this" is now measured in hours, not weeks.

[CALLOUT] The skill isn't coding. It's clarity — knowing what you want, communicating it well, and iterating until you get there. Every experienced executive already has this. They just haven't applied it here yet.

## What "Getting Invested" Actually Means

I want to be specific here, because "executives should use AI" has become its own content genre — long on encouragement, short on actionable guidance.

When I say get invested, I mean three things:

**Pick something real.** Not a toy example. Not "let me ask ChatGPT a question." Find something you actually need — a process eating time, a tool your team wishes existed, a communication you've been avoiding. Use AI to make genuine progress on it.

**Do it yourself.** Not through an assistant. Sit with the tool. Feel the friction. Notice where it's impressive and where you have to push back. The learning is entirely in the doing — it cannot be delegated.

**Talk about what you find.** Teams take their cues from leadership. When senior people experiment openly and share what they're learning, permission spreads. When AI gets handed entirely to IT, a ceiling forms.

The organizations I see moving fastest aren't the ones with the best AI strategy presentations. They're the ones where curious leaders are running small experiments and telling their teams about them.

## The Compounding Advantage

I spent twelve years in the Army. One of the clearest lessons of that career: the organizations that win are rarely the ones with the most resources. They're the ones that develop better judgment faster — through experience, iteration, and honest reflection on what worked and what didn't.

The same dynamic is playing out right now with AI.

The executives who are running experiments aren't just getting more efficient. They're developing intuition. They know which tools to reach for. They know how to frame a problem for AI collaboration. They know where the tools shine and where human judgment is irreplaceable. That knowledge takes time to build — and it can't be absorbed secondhand.

[CALLOUT] The gap between those experimenting and those waiting isn't a knowledge gap. It's an experience gap. And experience only closes one way.

## The Cost of Waiting

In previous technology cycles, there was a reasonable window to wait for solutions to mature before adopting them. That playbook worked for the internet. It worked for cloud. It worked for mobile.

The velocity of this cycle is different. Not just because the technology is improving faster — it is — but because the advantage being built by early experimenters is cognitive. The people running experiments now are developing a kind of judgment that will be genuinely difficult to replicate later.

Worse, the organizations that develop AI-native workflows, AI-assisted decision-making, and AI-accelerated execution create structural advantages. The gap doesn't just persist — it widens.

## Where to Start

Spend an hour with Claude or another AI tool working on one real problem in your business. Not a test. Not "let me see what this does." Pick a problem you've been meaning to tackle and just start talking to the tool about it.

You'll be frustrated at first. Your first few prompts will produce generic output. That's normal — push through it. Give feedback. Show it what good looks like. After an hour, you'll have more clarity about what these tools can actually do for your work than any article or presentation could provide.

If you want to compare notes — or explore what AI fluency could look like across your organization — reach out. That's a conversation I'm always glad to have. And if something here sparked a thought, drop a comment below. I read all of them.
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

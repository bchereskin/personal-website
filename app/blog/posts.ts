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
    slug: 'i-asked-ai-to-hack-my-website',
    title: 'AI Closed the Technical Gap. It Opened a Judgment Gap.',
    excerpt: 'I shipped five features in a week using AI. Then I asked it to audit what I built — and it found a hole I never would have caught on my own. The technical gap is closing. What is opening in its place matters more.',
    date: '2026-03-03',
    readTime: '6 min read',
    category: 'AI & Building',
    content: `
I shipped five features for this website in a single week. Comment replies. Subscriptions. Comment editing. A mobile fix. A full content refresh across every blog post. Each one went from idea to live in hours. Working, tested, deployed.

If you have been following this blog, you know the pattern by now. AI tools have collapsed the distance between wanting something and having it. The technical gap — the one that used to sit between a leader's vision and a working product — is closing fast.

But something happened this week that made me realize there is a new gap opening. And it might be more dangerous than the one that is closing.

## What the Audit Found

After that building sprint, I did something I had never done before. I asked Claude to run a security audit on everything I had built. Not a checklist — an actual adversarial review. Look at my code the way an attacker would.

It found a real vulnerability. My admin dashboard — where I can see every contact form submission and every comment — was checking whether someone was logged in, but not whether they were actually me. The fix was straightforward, and I caught it within hours of building the features, long before the site had any real traffic or user data at risk.

But the vulnerability itself is not the point. The point is that I built it, tested it, watched it work perfectly, and moved on to the next feature — never once thinking to ask whether it was actually secure. The speed felt like validation. Everything worked, so everything must be fine.

[CALLOUT] AI tools are closing the technical gap at an extraordinary pace. But they are simultaneously opening a judgment gap — the distance between what you can build and what you can evaluate. That gap is where the real risk lives.

## The Judgment Gap

The gap is not just about speed. It is about who is building now.

A year ago, if you wanted a website with user authentication and a database, you hired a developer — someone who had learned through years of practice that authentication and authorization are different things, that databases need access policies, that "it works" and "it is secure" are not the same statement. That knowledge was hard-won. It came from breaking things and fixing them over time.

Now, people who have never written a line of code are shipping full applications. I am one of them. And the AI tools are good enough that everything works on the surface. But underneath, there are best practices and failure modes that you do not know to ask about — because you have never been burned by them before.

This is not unique to software. Think about financial modeling. AI can now build a sophisticated DCF model or Monte Carlo simulation for someone who has never taken an accounting class. The spreadsheet will look professional. The formulas will be technically correct. But if you have never built a model from scratch, you might not question the discount rate assumptions, or notice that the revenue projections ignore seasonality, or understand why sensitivity analysis matters. The output looks like expertise, but the judgment behind it is missing.

The same pattern is emerging everywhere AI is lowering the barrier to entry. The tools can execute at an expert level, but they cannot replace the instinct for knowing what to question. That instinct comes from experience — and right now, millions of people are skipping straight to the output without it.

[CALLOUT] The judgment gap is not just about moving fast. It is about entire new populations of builders entering domains without the foundational knowledge to evaluate what they are creating. The tools close the skill gap. They do not close the wisdom gap.

## The Part That Matters

Here is the good news: the same tools that create this gap can close it.

I asked the same AI that helped me build these features to try to break them. It found the vulnerability, explained why it mattered, and walked me through the fix. The entire audit — reviewing every route, every permission, every database policy — took about an hour. The building sprint took a week.

That hour was more valuable than the week. Because the week created capability, but the hour created trust. Trust that what I built actually works the way I think it does.

[CALLOUT] Speed is a multiplier, not a direction. It amplifies whatever you are already doing — including your blind spots. The unlock is not just building with AI. It is building and auditing with AI.

## The Question Worth Asking

If you have been building with AI — shipping fast, stacking features, feeling the momentum — I want to ask you one thing.

When was the last time you asked it to challenge what you built?

Not test it. Not check that it works. Actually challenge it. Look at it from the perspective of someone trying to find the cracks. The tools make this easy. You do not need to be a security expert or a QA engineer. You need to be willing to ask "what did I miss?" and honest enough to act on the answer.

The technical gap is closing. That is exciting and real. But the judgment gap is opening right alongside it — and it is not just affecting developers. It is affecting anyone who uses AI to operate in a domain where they lack deep experience. The leaders who thrive in this new world will not just be the ones who build the fastest. They will be the ones who know when to stop and ask the hard questions.

I am curious — have you hit a moment like this? Whether it is code, financial models, marketing strategy, or anything else — a time when AI helped you build something impressive, and then you realized you had missed something important? Drop it in the comments. And if you want to follow along as I keep building and breaking things in public, subscribe for updates or reach out through the contact page.
    `,
  },
  {
    slug: 'from-static-site-to-product',
    title: 'I Turned My Website Into a Product in One Day. Here\'s What That Means.',
    excerpt: 'A contact form that logs leads to a database. A comment section for readers. A private admin dashboard. All built without writing code — and what it reveals about the new economics of building.',
    date: '2026-02-28',
    readTime: '7 min read',
    category: 'AI & Building',
    content: `
Let me tell you about a moment that stopped me cold.

It was a Friday night. I had just finished building a comment section for this blog, a lead-capture system for my contact form, an email notification pipeline, and a password-protected admin dashboard. From scratch. In a single day.

I sat back and stared at the screen. Not because anything had gone wrong. Because I was trying to reconcile what had just happened with everything I thought I knew about building software.

Forty-eight hours earlier, this was a static website. Nice design. A couple of blog posts. A contact page that sent emails into the void. The kind of site that looks professional but does nothing.

Now it was a product. A working system. And the part that made me sit there in silence was not the technology. It was realizing how many things I had postponed in my career — not because they were hard, but because the cost of building them made postponing feel rational.

That cost just changed.

## The Old Loop Is Broken

I need to describe the old world to explain why the new one matters.

Before AI, the path from "I want a contact form that emails me and logs submissions to a database" to a working product looked like this: write a brief. Find a developer. Wait for their calendar to open. Have a kickoff call. Wait. Review a first pass. Send notes. Wait. Test. Find bugs. Wait. Deploy.

Three weeks if you were lucky. And that was for something simple. Something a curious operator with clear thinking could describe in two sentences.

With Claude Code, I described what I wanted in plain English. It built it. I tested it, noticed the email format was wrong, said so, and it was fixed in thirty seconds. The entire loop — from idea to deployed, working product — collapsed into a conversation.

Not a conversation with a vendor. Not a conversation with my engineering team. A conversation with an AI tool, sitting on my couch on a Friday night.

[CALLOUT] The most dangerous question in business right now is not "what should we build?" It is "what have we been putting off because building felt too expensive?" That list just became a to-do list.

## What I Actually Built

I want to name the tools because demystifying this matters. The magic is not in any single tool. It is in the combination — and in the fact that none of them required me to write code or manage infrastructure.

[MODEL] Claude Code | The AI co-engineer. I described what I wanted in plain language and it wrote the software. When something did not work, I told it what was wrong — not in technical terms, just in human terms — and it fixed it. This is the tool that breaks the old equation. It does not need you to speak code. It needs you to think clearly.

[MODEL] Supabase | The database. Every contact form submission and blog comment is automatically stored here. Think of it as a spreadsheet that lives on the internet and connects to everything. Free to start, nothing to manage, nothing to maintain.

[MODEL] Resend | The notification layer. Every time someone fills out my contact form or leaves a comment, I get an email instantly. I can reply directly from my inbox. No dashboard to check, no submissions to go hunting for.

[MODEL] Vercel | Where the site lives. Every change deploys automatically. I make an update with Claude, and it is live in seconds. Zero servers. Zero deployment process.

Four tools. One afternoon. A working product that would have taken weeks and thousands of dollars six months ago.

## Translation for the Boardroom

Let me restate what was built, because the tools are less important than the capability.

In one day, a single operator with no engineering background created:

- A **lead capture system** that logs every inquiry automatically and never loses a submission
- An **instant notification pipeline** so no opportunity falls through the cracks
- A **reader engagement layer** that turns a one-way blog into a two-way conversation
- A **private admin dashboard** with authentication, giving me a single view of all contacts and comments

That is the foundation of a CRM. It is also the skeleton of a client portal, a pipeline tracker, or a newsletter platform. The infrastructure is live. What gets built next is a question of priorities, not resources. Not budget. Not headcount. Priorities.

Let that sink in. Because if you run a team, you have a list of things like this. Tools you have been meaning to build. Workflows you have been meaning to automate. Internal dashboards that would save your team hours every week. That list has been growing for years because the cost of building never justified the effort.

[CALLOUT] The backlog of "things we would build if we had a developer" just became the most valuable strategic document in your company. Every item on it is now achievable in days, not quarters.

## Why This Hits Different for Operators

I spent twelve years in the Army — much of it leading aviation operations where the margin between a good plan and a disaster was measured in minutes. The lesson that shaped me most: operational advantage does not come from having the most resources. It comes from eliminating friction between intent and execution.

You see a problem. You decide what to do about it. And then the thing actually gets done, without a fourteen-step process and three layers of delegation between your decision and the result.

AI tools are the most significant operational leverage I have encountered since leaving the military. Not because the technology is impressive — although it is. Because they collapse the distance between what a leader can imagine and what that leader can actually ship. The gap between thinking and doing just got very, very small.

The companies I watch accelerating right now are not necessarily the ones with the biggest engineering teams. They are the ones where operators — people who think in systems and workflows and customer outcomes — are learning to direct AI tools themselves. Building in hours what used to require months. Testing ideas before committing to full roadmap slots. Moving at the speed of their own judgment instead of the speed of their vendor's calendar.

That is a real, compounding competitive advantage. And it is available right now to any operator willing to spend one honest afternoon learning what these tools can do.

## The Question I Cannot Stop Thinking About

What have you been putting off?

Not the moonshot ideas. The practical ones. The reporting dashboard that would give your leadership team real visibility. The client onboarding workflow that is still half-manual and half-email. The internal tool that three people on your team have asked for twice and been told "it is on the roadmap."

Those are not hypothetical projects anymore. They are this weekend.

I keep having this conversation with operators and founders — people who run things, people who build things — and the moment always comes where they say some version of "wait, I could actually do that myself?" That moment is what I am writing about. That is the shift.

So I will ask you directly: what is on your list? What have you been putting off because the cost of building never justified the effort? I am genuinely curious — drop it in the comments. Some of the best conversations I have had started with someone sharing exactly that.
    `,
  },
  {
    slug: 'building-my-website-with-ai',
    title: 'I Built This Website Without Writing Code. Here\'s What That Actually Felt Like.',
    excerpt: 'A non-technical operator goes from blank screen to live custom website in one afternoon — and discovers that the bottleneck was never technical skill. It was something else entirely.',
    date: '2026-02-08',
    readTime: '7 min read',
    category: 'AI & Building',
    content: `
I want to tell you about the moment I almost closed the laptop.

It was about forty-five minutes into my first session with Claude Code. I had described the website I wanted — dark design, earthy tones, something that felt like a serious operator built it, not a SaaS landing page. And what came back was... fine. Generic. The kind of output that confirms every skeptic's suspicion that AI just produces average work.

I almost stopped. Almost chalked it up as an interesting experiment that did not quite work. Almost went back to my plan of hiring a developer and spending three weeks going back and forth on revisions.

But I did not stop. I pushed back. I showed it a reference site I admired and said "analyze what makes this feel premium." I described the feeling I wanted — not the layout, not the fonts, the feeling. And something shifted.

What came back next was better than what I had described. Not because the AI had some secret knowledge. Because by showing it my taste instead of trying to articulate specifications, I had finally communicated what I actually meant.

That was the moment this stopped being a tech experiment and became something I needed to write about.

## The Lesson Before the First Line of Code

The first thing I did was not type a prompt. It was find a reference.

I want to emphasize this because it changed everything that followed. I did not try to describe my ideal website from scratch. I found a site that made me feel the way I wanted my site to make others feel, and I asked Claude to tell me why it worked — what design choices created the sense of quality, what spacing decisions made it feel unhurried, what color relationships gave it warmth.

Then I said: "Now build me something with that DNA, but darker, earthier, and more personal."

[CALLOUT] You do not need to know what you want in technical terms. You need to know it when you see it. That is a skill every experienced leader already has — and it turns out to be the most important one in this new world.

This matters beyond website design. It is the key to working with AI on anything. Most people fail at AI not because the tools are limited but because they describe their needs like a requirements document instead of like a human being with taste and judgment. Show, do not specify. React, do not prescribe.

## Three Tools, Each with One Job

The whole project used three tools. None required technical expertise. Each handled a different dimension of the work:

[MODEL] Claude Code | The builder. I described what I wanted in plain language and it wrote the code. I gave feedback — "that headline feels too corporate," "the spacing between sections needs to breathe more," "the green is too bright" — and it iterated in real time. The conversation felt less like using software and more like directing a skilled contractor who never gets frustrated and never needs you to explain something twice.

[MODEL] ChatGPT | The visual partner. I needed a logo concept — something representing my military background and forward momentum. I described the feeling, got visual options back, reacted to them, refined. I did not know I wanted a shield-and-arrow concept until I saw it. Then it was obviously right. This is how creative work actually happens: not by specifying what you want, but by recognizing it when it appears.

[MODEL] Vercel | The launchpad. Where the site lives. Every change goes live within seconds. No server management, no deployment process. I describe a change to Claude, it builds it, it is live. The whole loop is under a minute.

Three tools. One afternoon. A fully custom website with animated sections, a blog, a color palette I chose, and a logo concept I sketched in words. Not a template. Not a theme. Something that came from my head and now exists on the internet.

## When Speed Changes What Is Possible

Here is the part that is genuinely hard to explain until you have experienced it.

In a traditional process, every change request has a cost. A developer's time. A communication gap where your intent gets translated into their interpretation. A waiting period. A revision cycle. That cost shapes what you ask for in ways you do not even notice. You batch your requests. You accept things that are close enough. You let go of small details that would make the difference between "this is fine" and "this is mine."

With AI, I noticed the spacing was off between two sections. I said so. Twenty seconds later, fixed. I tried a different color for the accent. Did not like it. Changed it back. Fifteen seconds. I had an idea for an animation that might be too much. Tried it. Loved it. Kept it.

In ninety minutes, I made more creative decisions — real ones, not compromises — than I would have made in two weeks of traditional back-and-forth.

[CALLOUT] When you can try anything in seconds, you stop settling. You take creative risks you would never take if each one cost hours of someone else's time. That is not just faster work. It is a fundamentally different relationship with what you are building.

This is the thing the skeptics miss. They evaluate AI output as if the first result is the final result. It is not. The first result is the starting point for a conversation that moves at the speed of thought. And when the conversation moves that fast, the quality of the final product goes up, not down — because you actually explore the space of possibilities instead of accepting the first thing that is close enough.

## The Bottleneck Was Never Technical

Here is the shift I keep coming back to. The one that changed how I think about my work, my team, and my company.

For most of the last thirty years, the bottleneck between a leader's vision and something actually getting built was technical skill. You either had it or you hired it. And if you hired it, you accepted the distance — the translation loss, the waiting, the compromise — between what you imagined and what eventually shipped.

Non-technical leaders got very good at working within that constraint. We learned to write clear briefs. We learned to be patient. We learned to accept that what got built would be a reasonable approximation of what we wanted, and that was good enough.

AI tools do not eliminate technical skill. Engineers are doing extraordinary things with these tools that I cannot do. But for a wide and growing category of work — websites, internal tools, dashboards, prototypes, content systems, workflows — the constraint is no longer skill. It is clarity.

Can you describe what you want? Can you react honestly to what you see? Can you articulate why something feels wrong, even if you cannot name the technical fix? Can you keep pushing until it is right?

[CALLOUT] If you can describe what you want clearly enough to give feedback on it, you can build it. That sentence was not true two years ago. It is true now. And it changes everything about who gets to create.

## What I Would Tell You Over Coffee

If you are a leader who has been watching this from the sidelines — curious but skeptical, intrigued but not yet invested — here is what I would say.

Pick something small and real. Not a demo. Not a sandbox exercise. Something you actually want to exist in the world. A personal site, a tool for your team, a prototype for an idea you have been carrying around.

Your first attempt will produce generic output. That is not a failure — it is the starting line. Push through it. Show the tool a reference. Describe how you want it to feel, not just what you want it to do. Give honest feedback. Iterate.

By the third or fourth round, something shifts. You stop thinking about the tool and start thinking about what you are building. You stop wondering if AI is good enough and start wondering what else you could build. That is the moment that matters. That is when the future stops being abstract and becomes personal.

What would you build if you could build anything? I am not being rhetorical — I genuinely want to know. Drop a comment below. I have found that the most interesting ideas come from operators who have been quietly carrying them around, waiting for the right moment. This might be it.
    `,
  },
  {
    slug: 'non-technical-execs-ai-revolution',
    title: 'The AI Experiments Every Executive Should Be Running Right Now',
    excerpt: 'The executives pulling ahead are not waiting for IT to roll out an approved solution. They are running their own experiments — and building a cognitive advantage that compounds every single week.',
    date: '2026-02-01',
    readTime: '8 min read',
    category: 'Leadership',
    content: `
I want to tell you about two CEOs I spoke with last month. Same industry, similar-sized companies, comparable resources.

The first one spent thirty minutes showing me a tool she had built. Nothing fancy — a dashboard that pulled her company's support tickets, categorized them by root cause using AI, and surfaced patterns that her team had been missing for months. She had built it herself in an evening, using Claude, after getting frustrated that the data existed but nobody was looking at it the right way.

She did not build it because she wanted to become a developer. She built it because she saw a problem, realized she could solve it without waiting for anyone, and decided to try. The insight it produced — that 40 percent of their support volume came from a single onboarding step — led to a product change that reduced ticket volume by a third within six weeks.

The second CEO had a polished AI strategy deck. Fifteen slides. Vendor evaluations. A roadmap. A timeline for a company-wide rollout in Q3. He asked thoughtful questions about governance and data security. He was being responsible.

He was also twelve months behind.

Not twelve months behind on a technology adoption timeline. Twelve months behind on developing the judgment to know what AI can actually do for his business. And that kind of gap does not close with a strategy deck.

## This Wave Breaks the Pattern

Every executive in this room has navigated a technology shift before. The internet. Mobile. Cloud. Each one demanded adaptation — new channels, new infrastructure, new ways of reaching customers and managing operations.

But notice the pattern. In every one of those waves, the job of a non-technical leader was the same: understand what the technology can do, then direct others to build it. Your value was in the vision and the decision-making. The building was someone else's job.

This wave breaks that pattern.

For the first time, a COO can prototype the internal dashboard she has been requesting for six months. A CMO can build the content workflow he sketched on a whiteboard last quarter. A founder can turn the onboarding process she has been documenting in a Google Doc into a working tool — not in six weeks, but in an afternoon.

Not because these leaders have become engineers. Because the distance between "I want something that does this" and "here is something that does this" collapsed so dramatically that for a growing category of work, directing and doing are now the same activity.

[CALLOUT] The skill that matters is not coding. It is clarity — knowing what you want, communicating it precisely, and iterating until you get there. Every experienced executive already has this. They just have not applied it to building yet.

## What "Getting Invested" Actually Looks Like

I need to be specific here, because "executives should use AI" has become background noise. Everyone says it. Almost nobody explains what it means in concrete, operational terms.

When I say get invested, I mean three things — and the order matters.

**Pick a real problem, not a demo.** Not "let me ask ChatGPT a question and see what happens." Find something you actually need solved. A weekly report that takes four hours to compile. A process your team has been begging to automate. A communication you have been putting off because it requires synthesizing information from six different sources. Use AI to make genuine progress on it. The learning comes from the struggle of applying the tool to a real constraint, not from a sandbox.

**Do it yourself. Personally.** Not through an assistant. Not through a pilot team. Sit with the tool. Feel the friction of your first bad prompt. Notice where the output is surprisingly good and where it misses completely. Develop your own sense of when to trust it and when to push back. This judgment cannot be delegated. It cannot be absorbed from a briefing. It can only be earned through direct experience — the same way you earned your judgment about people, markets, and operations.

**Talk about what you find. Openly.** This is the multiplier that most leaders skip. Teams take their cues from senior leadership. When an executive experiments with AI and shares what they learned — the wins and the failures — it gives the entire organization permission to do the same. When AI gets handed entirely to IT as a "managed rollout," a ceiling forms. The people closest to the problems never get the chance to discover that they could solve them.

[CALLOUT] The organizations moving fastest are not the ones with the best AI strategy decks. They are the ones where curious leaders are running small experiments, talking about the results, and building a culture where the question is not "are we allowed to try this?" but "what should we try next?"

## The Advantage That Cannot Be Purchased

I spent twelve years in the Army, much of it in aviation — an environment where the quality of your decisions under pressure is the only thing that matters. One of the clearest lessons of that career: the organizations that win are rarely the ones with the most resources. They are the ones that develop better judgment faster.

Not better information. Better judgment. The ability to look at a situation, pattern-match against experience, and make a sound decision when the data is incomplete and the clock is running. That ability comes from one place: repetition. Doing the thing, reflecting on what happened, and doing it again slightly better.

The same dynamic is playing out right now with AI — and it should make every waiting executive uncomfortable.

The leaders who are experimenting are not just getting more efficient. They are developing intuition. They are learning which problems AI handles well and which ones require human judgment. They are building a mental model for how to frame a question, how to evaluate an output, how to iterate toward something genuinely useful. They are learning when to trust the tool and when to override it.

That intuition takes time to build. It compounds with every experiment. And here is the part that matters most: it cannot be acquired secondhand. You cannot read your way to it. You cannot hire your way to it. You cannot buy a platform that gives it to you. You have to earn it, the same way you earned every other form of professional judgment you possess.

[CALLOUT] The gap between those experimenting and those waiting is not a knowledge gap. It is an experience gap. And experience only closes one way — by doing the work.

## The Real Cost of Waiting

In previous technology cycles, waiting was a defensible strategy. Let the early adopters work out the bugs. Let the vendors build mature solutions. Let the market settle, then adopt the winning platform. For the internet, for cloud computing, for mobile — this worked.

It will not work this time. And the reason is subtle but critical.

The advantage being built by early experimenters is not technological. It is cognitive. The CEO who built that support ticket dashboard did not just find an insight her team missed. She developed a new way of thinking about her business data. She learned that she could go from question to answer in an evening instead of a quarter. She started asking different questions — bigger ones, more frequent ones, ones she would never have bothered asking when each answer required a three-week analytics project.

That shift in thinking is the real advantage. And it produces a second-order effect that accelerates the gap: organizations where leaders think this way start building AI-native workflows. AI-assisted decision-making. AI-accelerated execution. Each one creates a structural advantage that makes the next one easier to build. The gap does not just persist. It widens.

Meanwhile, the organizations that are waiting are not standing still. They are falling behind at an accelerating rate, because the target they will eventually need to catch is moving faster than they are.

## Your First Hour

Here is what I would ask you to do this week. Not this quarter. This week.

Block one hour. Pick one real problem in your business — something you have been meaning to address, something that has been sitting in the back of your mind. Open Claude or another AI tool and just start talking to it about the problem.

You will be frustrated at first. Your first prompts will produce vague, generic output. That is not the tool failing — that is the starting line. Push through it. Tell the tool what is wrong with its response. Give it context. Be specific about what good looks like. Show it examples.

After sixty minutes, you will have learned more about what AI can and cannot do for your work than any strategy presentation, analyst report, or conference keynote could teach you. Not because the information is hard to find. Because the understanding only comes from doing.

And here is what I have noticed about that first hour: it does not end at sixty minutes. Something clicks. You start seeing problems differently. You start asking "what if I just tried..." about things you had mentally filed under "someday." That shift — from someday to today — is the most important thing happening in business right now. And it is available to anyone willing to sit down and start.

If you want to compare notes on what you find — or explore what building AI fluency could look like across your organization — reach out through the contact page. That is a conversation I always look forward to. And if something here sparked a thought or a question, drop it in the comments below. I read every single one, and some of the best conversations I have had have started there.
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

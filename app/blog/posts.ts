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
    slug: 'building-high-performing-teams',
    title: 'Building High-Performing Teams: Lessons from the Trenches',
    excerpt: 'After years of scaling operations, here are the key principles I\'ve learned about building teams that deliver exceptional results.',
    date: '2026-01-28',
    readTime: '5 min read',
    category: 'Leadership',
    content: `
Building high-performing teams isn't about finding the perfect people—it's about creating the right environment for good people to thrive.

## Start with Clear Expectations

The foundation of any successful team is clarity. Every team member should understand:
- What success looks like in their role
- How their work connects to company goals
- What autonomy they have to make decisions

## Hire for Culture Add, Not Culture Fit

Culture fit can lead to homogeneous teams. Instead, look for people who share your values but bring different perspectives, backgrounds, and approaches to problem-solving.

## Create Psychological Safety

Teams perform best when members feel safe to take risks, ask questions, and admit mistakes. As a leader, model vulnerability and celebrate learning from failures.

## Invest in Growth

High performers want to grow. Create clear paths for advancement and invest in their development—even if it means they eventually outgrow your team.

The best teams I've built weren't the ones with the most experienced people. They were the ones where everyone felt ownership, trusted each other, and were genuinely excited about the mission.
    `,
  },
  {
    slug: 'operational-excellence-startup',
    title: 'Operational Excellence in Early-Stage Startups',
    excerpt: 'Why building operational foundations early can be the difference between scaling successfully and hitting a wall.',
    date: '2026-01-15',
    readTime: '7 min read',
    category: 'Operations',
    content: `
Most startups don't think about operations until they're forced to. By then, they're often dealing with technical debt, process chaos, and scaling challenges that could have been prevented.

## The Right Time to Build Foundations

The best time to establish operational foundations is before you desperately need them. This doesn't mean over-engineering—it means being intentional about:

- **Documentation**: Start simple, but document key processes from day one
- **Data hygiene**: Clean data early is infinitely easier than cleaning it later
- **Tool selection**: Choose tools that can scale with you

## Common Mistakes I've Seen

### 1. Premature Optimization
Don't build for 10,000 users when you have 100. But do build with the awareness that you'll need to evolve.

### 2. Ignoring Technical Debt
A little debt is fine. Compounding debt will eventually halt your progress.

### 3. Hero Culture
If your operations depend on any single person working 80-hour weeks, you have a systems problem, not a people problem.

## The Payoff

Companies that invest in operational excellence early can move faster when it matters most—during rapid growth phases when your competitors are drowning in chaos.
    `,
  },
  {
    slug: 'advisor-founder-relationship',
    title: 'What Makes an Effective Advisor-Founder Relationship',
    excerpt: 'Insights on how to maximize value from advisory relationships, from both sides of the table.',
    date: '2026-01-02',
    readTime: '4 min read',
    category: 'Advisory',
    content: `
Having been both a founder seeking advice and an advisor providing it, I've learned that the best advisory relationships share common characteristics.

## For Founders Seeking Advisors

### Be Specific About What You Need
"I need help with growth" is too vague. "I need help building our first sales playbook for enterprise customers" gives an advisor something concrete to work with.

### Come Prepared
The best meetings happen when founders come with specific questions, context, and decisions they're weighing. Don't waste time on updates—send those async.

### Act on Advice (Or Explain Why Not)
Nothing demotivates an advisor faster than giving the same advice repeatedly with no action taken. If you disagree, say so—good advisors appreciate the dialogue.

## For Advisors

### Listen More Than You Talk
Your job isn't to prove how smart you are. It's to understand the founder's specific situation and provide relevant guidance.

### Be Available When It Matters
The most valuable thing you can offer is responsiveness during critical moments—fundraising, key hires, pivotal decisions.

### Know Your Limits
Don't pretend to have expertise you don't have. The best advisors are clear about where they can and can't help.

The most rewarding advisory relationships I've had were genuine partnerships—where both parties learned and grew together.
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

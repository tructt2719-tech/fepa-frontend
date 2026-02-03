import saveMoneyImg from "../assets/save-money.jpg";
import creditScoreImg from "../assets/credit-score.jpg";
import budgetRuleImg from "../assets/budget-rule.jpg";
import emergencyFundImg from "../assets/emergency-fund.jpg";
import debtManagementImg from "../assets/debt-management.jpg";
import investingBasicsImg from "../assets/investing-basics.jpg";

export const blogCategories = [
  "All",
  "Saving Tips",
  "Budgeting",
  "Investing",
  "Debt Management",
  "Financial Education",
];

// export const featuredBlog = {
//   id: 1,
//   category: "Saving Tips",
//   readTime: "5 min read",
//   title: "10 Simple Ways to Save Money Every Month",
//   excerpt:
//     "Discover practical tips to cut unnecessary expenses and build your savings effortlessly.",
//   image: "https://source.unsplash.com/1200x800/?saving,money",
// };
// export const featuredBlog = {
//   id: 1,
//   slug: "10-simple-ways-to-save-money-every-month",
//   category: "Saving Tips",
//   readTime: "5 min read",
//   title: "10 Simple Ways to Save Money Every Month",
//   excerpt:
//     "Discover practical tips to cut unnecessary expenses and build your savings effortlessly.",
//   image: "https://source.unsplash.com/1200x800/?saving,money",
//   content: `
//     <p>Saving money doesn’t have to be difficult.</p>

//     <h2>1. Track your expenses</h2>
//     <p>Understand where your money goes every month.</p>

//     <h2>2. Set monthly goals</h2>
//     <p>Clear goals help you stay disciplined.</p>

//     <h2>3. Cut unnecessary subscriptions</h2>
//     <p>Cancel what you don’t use.</p>
//   `,
// };

// export const blogs = [
//   {
//     id: 2,
//     slug: "understanding-credit-scores",
//     category: "Financial Education",
//     readTime: "8 min read",
//     date: "2026-01-02",
//     title: "Understanding Credit Scores: A Complete Guide",
//     excerpt:
//       "Learn what affects your credit score and how to improve it for better financial opportunities.",
//     image: "https://source.unsplash.com/800x600/?finance,documents",
//     content: `
//       <p>Your credit score impacts many financial decisions.</p>
//       <h2>What is a credit score?</h2>
//       <p>It measures your creditworthiness.</p>
//     `,
//   },
//   {
//     id: 3,
//     slug: "50-30-20-budget-rule",
//     category: "Budgeting",
//     readTime: "6 min read",
//     date: "2026-01-01",
//     title: "The 50/30/20 Budget Rule Explained",
//     excerpt:
//       "A simple budgeting framework that helps you manage your income effectively.",
//     image: "https://source.unsplash.com/800x600/?budget,planning",
//     content: `
//       <h2>50%</h2><p>Needs</p>
//       <h2>30%</h2><p>Wants</p>
//       <h2>20%</h2><p>Savings</p>
//     `,
//   },
//   {
//     id: 4,
//     category: "Saving Tips",
//     readTime: "7 min read",
//     date: "2025-12-28",
//     title: "How to Build an Emergency Fund",
//     excerpt:
//       "Step-by-step guide to creating a financial safety net for unexpected expenses.",
//     image: "https://source.unsplash.com/800x600/?saving,money,jar",
//   },
//   {
//     id: 5,
//     category: "Investing",
//     readTime: "10 min read",
//     date: "2025-12-25",
//     title: "Investment Basics for Beginners",
//     excerpt:
//       "Start your investment journey with these fundamental concepts and strategies.",
//     image: "https://source.unsplash.com/800x600/?investment,stocks",
//   },
//   {
//     id: 6,
//     category: "Debt Management",
//     readTime: "9 min read",
//     date: "2025-12-22",
//     title: "Managing Debt: Strategies That Work",
//     excerpt:
//       "Effective methods to pay off debt faster and regain financial freedom.",
//     image: "https://source.unsplash.com/800x600/?debt,finance",
//   },
// ];

export const featuredBlog = {
  id: 1,
  slug: "10-simple-ways-to-save-money-every-month",
  category: "Saving Tips",
  readTime: "5 min read",
  title: "10 Simple Ways to Save Money Every Month",
  excerpt:
    "Discover practical tips to cut unnecessary expenses and build your savings effortlessly.",
  image: saveMoneyImg,
  content: `
    <h2>Introduction</h2>
    <p>
      Saving money is the foundation of personal financial stability.
      Regardless of your income level, the habit of saving determines
      how prepared you are for emergencies, opportunities, and long-term goals.
      This article serves as a cornerstone for all other financial topics
      discussed in our blog series.
    </p>

    <h2>1. Understand Your Cash Flow</h2>
    <p>
      Before budgeting or investing, you must understand how money flows in and out.
      Track every source of income and every expense, no matter how small.
      This habit connects directly to the budgeting principles discussed
      in the 50/30/20 rule article.
    </p>

    <h2>2. Pay Yourself First</h2>
    <p>
      Saving should not be an afterthought. Allocate a portion of your income
      to savings immediately when you get paid. This concept also supports
      building an emergency fund, which we explore in another article.
    </p>

    <h2>3. Reduce Lifestyle Inflation</h2>
    <p>
      As income increases, expenses tend to increase as well.
      Avoid upgrading your lifestyle too quickly and redirect
      extra income toward savings or debt reduction.
    </p>

    <h2>4. Align Saving With Goals</h2>
    <p>
      Short-term goals like vacations and long-term goals like retirement
      give purpose to saving. Goal-oriented saving improves consistency
      and discipline over time.
    </p>

    <h2>Conclusion</h2>
    <p>
      Saving money is not about restriction but about intention.
      Mastering these basics prepares you for budgeting, debt management,
      and eventually investing.
    </p>
  `,
};

export const blogs = [
  {
    id: 2,
    slug: "understanding-credit-scores",
    category: "Financial Education",
    readTime: "8 min read",
    date: "2026-01-02",
    title: "Understanding Credit Scores: A Complete Guide",
    excerpt:
      "Learn what affects your credit score and how to improve it for better financial opportunities.",
    image: creditScoreImg,
    content: `
      <h2>What Is a Credit Score?</h2>
      <p>
        A credit score is a numerical representation of your creditworthiness.
        It influences loan approvals, interest rates, and even employment decisions
        in some regions.
      </p>

      <h2>How Credit Scores Relate to Saving and Budgeting</h2>
      <p>
        Poor budgeting often leads to missed payments, which negatively
        impact your credit score. This is why budgeting strategies such
        as the 50/30/20 rule are essential.
      </p>

      <h2>Long-Term Impact</h2>
      <p>
        A strong credit profile reduces financial stress and complements
        long-term investing strategies discussed in later articles.
      </p>

      <h2>Conclusion</h2>
      <p>
        Credit scores are not just numbers; they reflect financial habits
        built through saving discipline and responsible debt management.
      </p>
    `,
  },
  {
    id: 3,
    slug: "50-30-20-budget-rule",
    category: "Budgeting",
    readTime: "6 min read",
    date: "2026-01-01",
    title: "The 50/30/20 Budget Rule Explained",
    excerpt:
      "A simple budgeting framework that helps you manage your income effectively.",
    image: budgetRuleImg,
    content: `
      <h2>Understanding the Rule</h2>
      <p>
        The 50/30/20 rule divides income into needs, wants, and savings.
        It creates balance and prevents overspending while ensuring
        consistent savings.
      </p>

      <h2>Connection to Saving Habits</h2>
      <p>
        This rule operationalizes the saving strategies discussed in
        our featured article by providing a clear allocation system.
      </p>

      <h2>Supporting Emergency Funds</h2>
      <p>
        The 20% savings portion is the backbone of building an emergency fund,
        which is explored in the next article.
      </p>

      <h2>Conclusion</h2>
      <p>
        Budgeting is not restriction; it is structure.
        Without structure, saving and investing become inconsistent.
      </p>
    `,
  },
  {
    id: 4,
    slug: "how-to-build-an-emergency-fund",
    category: "Saving Tips",
    readTime: "7 min read",
    date: "2025-12-30",
    title: "How to Build an Emergency Fund",
    excerpt: "Protect yourself financially by creating a solid emergency fund.",
    image: emergencyFundImg,
    content: `
      <h2>Why Emergency Funds Matter</h2>
      <p>
        Unexpected expenses can derail financial plans.
        Emergency funds act as a buffer that prevents
        reliance on debt.
      </p>

      <h2>How Much Is Enough?</h2>
      <p>
        Most financial planners recommend saving three to six months
        of essential expenses, using budgeting frameworks
        such as the 50/30/20 rule.
      </p>

      <h2>Psychological Benefits</h2>
      <p>
        Financial security improves mental well-being and
        allows clearer decision-making when investing.
      </p>

      <h2>Conclusion</h2>
      <p>
        Emergency funds form the bridge between saving
        and long-term investing.
      </p>
    `,
  },
  {
    id: 5,
    slug: "smart-debt-management-strategies",
    category: "Debt Management",
    readTime: "6 min read",
    date: "2025-12-28",
    title: "Smart Debt Management Strategies",
    excerpt:
      "Learn effective strategies to reduce debt and regain financial control.",
    image: debtManagementImg,
    content: `
      <h2>The Role of Debt</h2>
      <p>
        Not all debt is harmful, but unmanaged debt
        disrupts saving and investing efforts.
      </p>

      <h2>Debt vs Saving</h2>
      <p>
        Balancing debt repayment with saving is critical.
        Emergency funds prevent new debt accumulation.
      </p>

      <h2>Long-Term Perspective</h2>
      <p>
        Effective debt management improves credit scores
        and frees resources for investing.
      </p>

      <h2>Conclusion</h2>
      <p>
        Debt control is a prerequisite for sustainable wealth building.
      </p>
    `,
  },
  {
    id: 6,
    slug: "investing-basics-for-beginners",
    category: "Investing",
    readTime: "9 min read",
    date: "2025-12-25",
    title: "Investing Basics for Beginners",
    excerpt: "A beginner-friendly guide to start investing with confidence.",
    image: investingBasicsImg,
    content: `
      <h2>Why Investing Comes Last</h2>
      <p>
        Investing should only begin after mastering saving,
        budgeting, emergency funds, and debt management.
      </p>

      <h2>Risk and Discipline</h2>
      <p>
        Investment success depends on long-term discipline,
        not short-term speculation.
      </p>

      <h2>Connecting All Topics</h2>
      <p>
        Saving provides capital, budgeting provides structure,
        emergency funds provide security, and debt management
        reduces risk. Investing is the final step.
      </p>

      <h2>Conclusion</h2>
      <p>
        Investing is not gambling when built on strong
        financial fundamentals.
      </p>
    `,
  },
];

export const quickTips = [
  {
    id: 1,
    title: "Automate Your Savings",
    desc: "Set up automatic transfers to your savings account on payday.",
  },
  {
    id: 2,
    title: "Track Every Expense",
    desc: "Use FEPA to monitor where your money goes each month.",
  },
  {
    id: 3,
    title: "Build Emergency Fund",
    desc: "Aim for 3–6 months of expenses in your emergency fund.",
  },
  {
    id: 4,
    title: "Review Subscriptions",
    desc: "Cancel unused subscriptions to save hundreds per year.",
  },
];

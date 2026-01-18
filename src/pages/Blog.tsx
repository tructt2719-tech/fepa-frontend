import "../styles/layout.css";
import "../styles/blog.css";

import {
  blogCategories,
  featuredBlog,
  blogs,
  quickTips,
} from "../data/mockBlogs";

export default function Blog() {
  return (
    <div className="page">
      {/* HEADER */}
      <h1>Financial Tips & Insights</h1>
      <p className="page-desc">
        Expert advice to help you achieve your financial goals
      </p>

      {/* CATEGORY FILTER */}
      <div className="blog-categories">
        {blogCategories.map((c, i) => (
          <button
            key={c}
            className={`chip ${i === 0 ? "gradient" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* FEATURED */}
      <div className="featured-blog">
        <img src={featuredBlog.image} alt="" />

        <div className="featured-content">
          <span className="chip gradient">Featured</span>

          <div className="meta">
            <span className="chip">{featuredBlog.category}</span>
            <span>{featuredBlog.readTime}</span>
          </div>

          <h2>{featuredBlog.title}</h2>
          <p>{featuredBlog.excerpt}</p>

          <button className="btn-primary">Read Article →</button>
        </div>
      </div>

      {/* BLOG GRID */}
      <div className="grid-3 mt-40">
        {blogs.map((b) => (
          <div key={b.id} className="blog-card">
            <div className="blog-image">
              <img src={b.image} alt={b.title} />
              <span className="blog-tag">{b.category}</span>
            </div>

            <div className="blog-content">
              <div className="blog-meta">
                <span>{b.readTime}</span>
                <span>{b.date}</span>
              </div>
              <h3>{b.title}</h3>
              <p>{b.excerpt}</p>
              <a className="link">Read More →</a>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK TIPS */}
      <div className="quick-tips mt-40">
        <h2>💡 Quick Financial Tips</h2>

        <div className="grid-2 mt-20">
          {quickTips.map((t) => (
            <div key={t.id} className="tip-card">
              <span className="tip-number">{t.id}</span>
              <div>
                <h4>{t.title}</h4>
                <p>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

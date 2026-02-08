import { useState } from "react";
import { Link } from "react-router-dom";
import { featuredBlog, blogs, quickTips, blogCategories } from "../data/mockBlogs";
import "../styles/blog.css";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredBlogs =
    activeCategory === "All"
      ? blogs
      : blogs.filter((b) => b.category === activeCategory);

  return (
    <div className="page" style={{ padding: "40px" }}>
      {/* HEADER */}
      <h1>Financial Tips & Insights</h1>
      <p className="page-desc">
        Expert advice to help you achieve your financial goals
      </p>

      {/* CATEGORY FILTER */}
      <div style={{ margin: "30px 0", display: "flex", gap: "12px" }}>
        {blogCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`chip ${activeCategory === cat ? "active gradient" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FEATURED BLOG */}
      <div
        className="featured-blog"
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "40px",
          padding: "30px",
          marginBottom: "50px",
        }}
      >
        <img
          src={featuredBlog.image}
          alt={featuredBlog.title}
          style={{ width: "100%", borderRadius: "16px" }}
        />
        <div className="featured-content">
          <span className="chip gradient">Featured</span>

          <p className="meta" style={{ marginTop: "12px" }}>
            {featuredBlog.category} • {featuredBlog.readTime}
          </p>

          <h2 style={{ margin: "16px 0" }}>{featuredBlog.title}</h2>
          <p>{featuredBlog.excerpt}</p>

          <Link
            to={`/blog/${featuredBlog.slug}`}
            className="link"
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "10px 20px",
              borderRadius: "12px",
              textDecoration: "none",
            }}
          >
            Read Article →
          </Link>
        </div>
      </div>

      {/* BLOG LIST */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "30px",
        }}
      >
        {filteredBlogs.map((blog) => (
          <Link
            to={`/blog/${blog.slug}`}
            key={blog.id}
            className="blog-card"
            style={{
              textDecoration: "none",
              overflow: "hidden",
            }}
          >
            <img
              src={blog.image}
              alt={blog.title}
              style={{ width: "100%", height: "180px", objectFit: "cover" }}
            />
            <div style={{ padding: "20px" }}>
              <p style={{ fontSize: "14px" }} className="blog-meta">
                {blog.category} • {blog.readTime}
              </p>

              <h3 style={{ margin: "10px 0" }}>{blog.title}</h3>
              <p>{blog.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* QUICK TIPS */}
      <div className="quick-tips mt-80">
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
};

export default Blog;
import { useParams, useNavigate } from "react-router-dom";
import { blogs, featuredBlog } from "../data/mockBlogs";
import "../styles/blog.css";

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Gộp featured + blog thường
  const allBlogs = [featuredBlog, ...blogs];
  const blog = allBlogs.find((b) => b.slug === slug);

  if (!blog) {
    return (
      <div style={{ padding: "40px", color: "white" }}>
        <h2>Blog not found</h2>
        <p>No corresponding article found.</p>
      </div>
    );
  }

  return (
    <>
      {/* 🔙 NÚT QUAY LẠI – LUÔN GHIM */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          border: "none",
          background: "#1f2937",
          color: "white",
          fontSize: "22px",
          cursor: "pointer",
          zIndex: 9999,
          boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
        }}
      >
        ←
      </button>

      {/* 📄 NỘI DUNG BÀI VIẾT */}
      <div
        style={{
          maxWidth: "900px",
          margin: "80px auto 40px",
          padding: "0 20px",
          color: "white",
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>{blog.title}</h1>

        <p style={{ opacity: 0.7, marginBottom: "30px" }}>
          {blog.category} • {blog.readTime}
        </p>

        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            style={{
              width: "100%",
              borderRadius: "12px",
              marginBottom: "30px",
            }}
          />
        )}

        <div
          style={{
            lineHeight: 1.8,
            fontSize: "16px",
          }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </>
  );
};

export default BlogDetail;

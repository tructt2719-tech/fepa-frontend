import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Search,
  Bell,
  Moon,
  Sun,
  User
} from "lucide-react";
import "../styles/topbar.css";

export default function Topbar() {
  const navigate = useNavigate();

  /* ================= THEME ================= */
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("fepa-theme") as "light" | "dark") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("fepa-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  /* ================= SEARCH ================= */
  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Expenses", path: "/expenses" },
    { label: "Budgets", path: "/budgets" },
    { label: "Debts", path: "/debts" },
    { label: "Blog", path: "/blog" },
    { label: "Analytics", path: "/analytics" }
  ];

  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<typeof menuItems>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleInputChange = (value: string) => {
    setKeyword(value);
    setActiveIndex(-1);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    setSuggestions(
      menuItems.filter(item =>
        item.label.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      setActiveIndex(prev => (prev + 1) % suggestions.length);
    }

    if (e.key === "ArrowUp") {
      setActiveIndex(prev =>
        prev <= 0 ? suggestions.length - 1 : prev - 1
      );
    }

    if (e.key === "Enter") {
      const target =
        activeIndex >= 0 ? suggestions[activeIndex] : suggestions[0];
      navigate(target.path);
      setKeyword("");
      setSuggestions([]);
    }
  };

  /* ================= NOTIFICATION ================= */
  const [showNotify, setShowNotify] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "The shopping budget has exceeded the limit",
      time: "1 hours ago",
      unread: true,
      path: "/budgets"
    },
    {
      id: 2,
      text: "You have a debt that needs to be paid",
      time: "5 hours ago",
      unread: true,
      path: "/debts"
    },
    {
      id: 3,
      text: "The monthly expense report is ready",
      time: "1 day ago",
      unread: false,
      path: "/analytics"
    },
    {
      id: 4,
      text: "Today's spending has exceeded the budget limit",
      time: "2 day ago",
      unread: false,
      path: "/expenses"
    }
  ]);

  useEffect(() => {
    const autoNotificationPool = [
      { text: "Weekly budget summary has been generated", path: "/budgets" },
      { text: "New expense category was detected", path: "/expenses" },
      { text: "Debt balance has been updated", path: "/debts" },
      { text: "New analytics insight is available", path: "/analytics" },
      { text: "New blog article about saving money is available", path: "/blog" }
    ];

    const autoNotify = setInterval(() => {
      setNotifications(prev => {
        const random =
          autoNotificationPool[
            Math.floor(Math.random() * autoNotificationPool.length)
          ];

        const newNotify = {
          id: Date.now(),
          text: random.text,
          time: "Just now",
          unread: true,
          path: random.path
        };

        return [newNotify, ...prev].slice(0, 30);
      });
    }, 20000);

    return () => clearInterval(autoNotify);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return n.unread;
    if (filter === "read") return !n.unread;
    return true;
  });

  const goToProfile = () => {
    navigate("/profile");
  };

  /* ================= RENDER ================= */
  return (
    <header className="topbar">
      /* left */
      <div className="topbar-left">
        <div className="logo">
          <div className="logo-circle">F</div>
          FEPA
        </div>

        <nav className="top-nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/expenses">Expenses</NavLink>
          <NavLink to="/budgets">Budgets</NavLink>
          <NavLink to="/debts">Debts</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
        </nav>
      </div>


      <div className="topbar-right">
        {/* SEARCH */}
        <div className="search-box">
          <Search size={16} />
          <input
            placeholder="Search..."
            value={keyword}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={handleSearchKey}
          />

          {keyword && (
            <div className="search-suggest">
              {suggestions.length ? (
                suggestions.map((item, index) => {
                  const start = item.label
                    .toLowerCase()
                    .indexOf(keyword.toLowerCase());
                  const end = start + keyword.length;

                  return (
                    <div
                      key={item.path}
                      className={`search-item ${
                        index === activeIndex ? "active" : ""
                      }`}
                      onMouseDown={() => {
                        navigate(item.path);
                        setKeyword("");
                        setSuggestions([]);
                      }}
                    >
                      {item.label.slice(0, start)}
                      <strong>{item.label.slice(start, end)}</strong>
                      {item.label.slice(end)}
                    </div>
                  );
                })
              ) : (
                <div className="search-no-result">No results</div>
              )}
            </div>
          )}
        </div>

        {/* THEME */}
        <button className="icon-btn" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* NOTIFICATION */}
        <div className="notify-wrapper">
          <button
            className="icon-btn notification"
            onClick={() => setShowNotify(!showNotify)}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notify-badge">
                {unreadCount > 5 ? "5+" : unreadCount}
              </span>
            )}
          </button>

          {showNotify && (
            <div className="fb-notify-panel">
              <div className="fb-notify-header">Announcement</div>

              <div className="fb-notify-tabs">
                <button
                  className={filter === "all" ? "active" : ""}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={filter === "unread" ? "active" : ""}
                  onClick={() => setFilter("unread")}
                >
                  Unread
                </button>
                <button
                  className={filter === "read" ? "active" : ""}
                  onClick={() => setFilter("read")}
                >
                  Read
                </button>
              </div>

              <div className="fb-notify-list">
                {filteredNotifications.map(n => (
                  <div
                    key={n.id}
                    className={`fb-notify-item ${n.unread ? "unread" : ""}`}
                    onClick={() => {
                      navigate(n.path);
                      setNotifications(prev =>
                        prev.map(item =>
                          item.id === n.id
                            ? { ...item, unread: false }
                            : item
                        )
                      );
                      setShowNotify(false);
                    }}
                  >
                    <div className="fb-dot" />
                    <div>
                      <div>{n.text}</div>
                      <div className="fb-time">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* USER */}
        <div
          className="avatar"
          onClick={goToProfile}
          style={{ cursor: "pointer" }}
          title="Trang cá nhân"
        >
          <User size={18} />
        </div>
      </div>
    </header>
  );
}

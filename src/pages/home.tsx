import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Khởi Đầu Hành Trình IT Của Bạn</h1>
          <p className="hero-subtitle">
            Khám phá kiến thức cơ bản, xây dựng nền tảng vững chắc và bước chân vào thế giới công nghệ chuyên nghiệp.
          </p>
          <button className="cta-button" onClick={() => navigate('/quiz')}>
            Làm Bài Quiz Của Hệ Thống
          </button>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="intro-section">
        <h2 className="section-heading">IT Là Gì?</h2>
        <p className="section-description">
          Công nghệ thông tin (IT) không chỉ là viết code. Đó là giải quyết vấn đề, tối ưu hóa quy trình và sáng tạo ra những sản phẩm mang lại giá trị cho người dùng. Đối với người mới, việc nắm vững các khái niệm cơ bản là bước đệm quan trọng nhất.
        </p>
      </section>

      {/* Core Knowledge Cards */}
      <section className="knowledge-section">
        <h2 className="section-heading">Kiến Thức Cốt Lõi</h2>
        <div className="cards-grid">
          <div className="knowledge-card">
            <div className="card-icon">💻</div>
            <h3>Lập Trình Cơ Bản</h3>
            <p>Hiểu về biến, vòng lặp, câu lệnh điều kiện và tư duy logic thông qua các ngôn ngữ phổ biến.</p>
          </div>
          <div className="knowledge-card">
            <div className="card-icon">🌐</div>
            <h3>Phát Triển Web</h3>
            <p>Làm quen với HTML, CSS, JavaScript để tạo ra giao diện người dùng tương tác và đẹp mắt.</p>
          </div>
          <div className="knowledge-card">
            <div className="card-icon">🗄️</div>
            <h3>Cơ Sở Dữ Liệu</h3>
            <p>Cách lưu trữ, truy xuất và quản lý dữ liệu an toàn, hiệu quả bằng SQL hoặc NoSQL.</p>
          </div>
          <div className="knowledge-card">
            <div className="card-icon">🤝</div>
            <h3>Kỹ Năng Mềm</h3>
            <p>Giao tiếp, làm việc nhóm, phân tích yêu cầu (BA) và quản lý thời gian trong dự án IT.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2026 Đào Tạo IT Cho Người Mới. Xây dựng nền tảng, kiến tạo tương lai.</p>
      </footer>
    </div>
  );
};

export default Home;

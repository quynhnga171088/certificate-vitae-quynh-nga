import { Fragment, useEffect, useRef } from 'react';

import './TheSystemFromUserVision.css';

const TheSystemFromUserVision = () => {
    const answered = useRef<Record<string, string>>({});
    const scores = useRef({ basic: 0, advanced: 0 });
    const quizAnswersVisible = useRef<boolean>(false);

    const SECTIONS = {
        basic: { ids: ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10'], total: 10 },
        advanced: { ids: ['q11','q12','q13','q14','q15','q16','q17','q18','q19','q20'], total: 10 }
    };

    const answers = {
        q1: 'b', q2: 'a', q3: 'c', q4:'b', q5:'d', q6:'a', q7:'b', q8:'c', q9:'a', q10:'d',
        q11: 'c', q12: 'b', q13: 'a', q14:'b', q15:'b', q16:'d', q17:'a', q18:'c', q19:'b', q20:'a'
    };

    const feedbacks = {
        q1: {correct:'Đúng! Đây là điểm xuất phát của mọi phân tích user-facing.',wrong:'Chưa đúng. Câu hỏi vàng: “User vào đây để làm gì?”'},
        q2: {correct:'Chính xác! Portal = cổng theo đối tượng sử dụng.',wrong:'Chưa đúng. Portal là cổng truy cập (Admin/User…), không phải tên miền hay database.'},
        q3: {correct:'Đúng! Admin cần màn hình lớn, thao tác phức tạp — thường là Web (+ CMS).',wrong:'Chưa đúng. Admin Portal chủ yếu dùng Web trên PC.'},
        q4: {correct:'Đúng! User portal phục vụ học viên/khách — hay có Web + App.',wrong:'Chưa đúng. User Portal thường có Web và/hoặc Mobile App.'},
        q5: {correct:'Chính xác! Role = vai trò trong hệ thống.',wrong:'Chưa đúng. Role là vai trò người dùng (Admin, Học viên…).'},
        q6: {correct:'Đúng! Function = một hành động user làm được.',wrong:'Chưa đúng. Function là hành động trên hệ thống (Login, Search…).'},
        q7: {correct:'Đúng! Internal = hệ thống cùng tổ chức, VD HRM.',wrong:'Chưa đúng. Internal là hệ thống nội bộ cùng công ty.'},
        q8: {correct:'Chính xác! Học viên là trải nghiệm chính của LMS.',wrong:'Chưa đúng. Primary user của LMS thường là Học viên.'},
        q9: {correct:'Đúng! CMS dùng để soạn/đăng nội dung, thường trong Admin.',wrong:'Chưa đúng. CMS phục vụ quản trị nội dung, không phải học viên làm quiz.'},
        q10: {correct:'Đúng! List câu hỏi dùng khi walkthrough / họp xác nhận.',wrong:'Chưa đúng. Dùng khi trình bày hiểu biết để hỏi khách hàng/team.'},
        q11: {correct:'Chính xác! Portal ≠ Platform — hai lớp khái niệm khác nhau.',wrong:'Chưa đúng. Portal theo đối tượng; Web/App/CMS là hình thức triển khai.'},
        q12: {correct:'Đúng! Trộn role là lỗi phổ biến khi mới làm BrSE.',wrong:'Chưa đúng. Viết function list riêng theo từng Role.'},
        q13: {correct:'Đúng! Udemy/Coursera là bên thứ ba → External.',wrong:'Chưa đúng. Đây là tích hợp External (bên ngoài).'},
        q14: {correct:'Đúng! Function list cần “user làm gì” + thuộc Role/ngữ cảnh nào — tránh chỉ ghi shell UI hay chi tiết kỹ thuật.',wrong:'Chưa đúng. Tối thiểu nên có hành động user + Role/ngữ cảnh; tên màn hình/API/DB không thay thế được ý nghĩa nghiệp vụ.'},
        q15: {correct:'Chính xác! Function list = danh mục hành động; User Flow = luồng bước và nhánh giữa các function/màn hình.',wrong:'Chưa đúng. User Flow mô tả trình tự và nhánh; Function list là bảng kê từng function — hai thứ bổ sung, không trùng.'},
        q16: {correct:'Chính xác! Glossary lấy từ dự án thật; AI chỉ hỗ trợ, phải verify.',wrong:'Chưa đúng. Lập từ tài liệu/họp/màn hình; AI hỗ trợ nhưng cần đối chiếu.'},
        q17: {correct:'Đúng! Quy tắc 1 function → 1 screen chính giúp mapping rõ.',wrong:'Chưa đúng. Thường 1 Function đi với 1 Screen chính.'},
        q18: {correct:'Chính xác! Đúng thứ tự 6 phần trong bài học.',wrong:'Chưa đúng. Thứ tự: Khái quát → Role → Function/Screen → User Flow & Detail → Glossary.'},
        q19: {correct:'Đúng! Leader thêm nhiệm vụ duyệt/giám sát giáo viên.',wrong:'Chưa đúng. Teacher Leader có thêm quyền duyệt bài, quản lý nhóm GV.'},
        q20: {correct:'Chính xác! VNPay = thanh toán học phí, hệ thống External.',wrong:'Chưa đúng. VNPay dùng để thu học phí online (External).'}
    };

    const selectOption = (el: HTMLElement) => {
        const block = el.closest('.question-block');
        if (!block) return;
        const qId = block.id;
        if (answered.current[qId]) return;
        block.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
        el.classList.add('selected');
        block.classList.remove('question-unanswered');
    }

    const checkAnswer = (btn: HTMLElement, qId: string, sectionKey: string) => {
        if (answered.current[qId]) return;
        const block = document.getElementById(qId);
        if (!block) return;
        const selected = block.querySelector('.option.selected') as HTMLElement;
        const fb = document.getElementById('fb-' + qId);

        if (!selected && fb) {
            fb.textContent = 'Bạn chưa chọn đáp án nào.';
            fb.className = 'answer-feedback wrong show';
            return;
        }

        const userVal = selected.getAttribute('data-val');
        const correctVal = answers[qId as keyof typeof answers];
        answered.current[qId] = userVal || '';

        block.querySelectorAll('.option').forEach(o => {
            if (o.getAttribute('data-val') === correctVal) o.classList.add('correct');
        });

        if (userVal === correctVal) {
            selected.classList.add('correct');
            fb!.textContent = '✓ ' + feedbacks[qId as keyof typeof feedbacks].correct;
            fb!.className = 'answer-feedback correct show';
            scores.current[sectionKey as keyof typeof scores.current]++;
        } else {
            selected.classList.add('wrong');
            fb!.textContent = '✗ ' + feedbacks[qId as keyof typeof feedbacks].wrong;
            fb!.className = 'answer-feedback wrong show';
        }

        (btn as HTMLButtonElement).disabled = true;

        const section = SECTIONS[sectionKey as keyof typeof SECTIONS];
        if (section.ids.every(id => answered.current[id])) {
            showSectionResult(sectionKey);
        }
    }

    function showSectionResult(sectionKey: string) {
        const total = SECTIONS[sectionKey as keyof typeof SECTIONS].total;
        const score = scores.current[sectionKey as keyof typeof scores.current];
        const box = document.getElementById('quiz-result-' + sectionKey);
        document.getElementById('result-score-' + sectionKey)!.textContent = score + '/' + total;

        const labelEl = document.getElementById('result-label-' + sectionKey);
        const commentEl = document.getElementById('result-comment-' + sectionKey);

        if (sectionKey === 'basic') {
            labelEl!.textContent = score === total ? 'Xuất sắc — Cơ bản!' : score >= 8 ? 'Rất tốt — Cơ bản' : score >= 6 ? 'Khá — ôn thêm Cơ bản' : 'Cần đọc lại Phần 1–2';
        } else {
            labelEl!.textContent = score === total ? 'Xuất sắc — Nâng cao!' : score >= 8 ? 'Rất tốt — Nâng cao' : score >= 6 ? 'Khá — ôn thêm Nâng cao' : 'Cần đọc lại toàn bài';
        }

        const pct = score / total;
        if (pct === 1) {
            commentEl!.textContent = 'Bạn nắm vững phần này. Có thể chuyển sang phần tiếp theo hoặc áp dụng ngay cho dự án thật.';
        } else if (pct >= 0.8) {
            commentEl!.textContent = 'Hiểu tốt. Xem lại các câu sai và làm lại một lần nữa cho chắc.';
        } else if (pct >= 0.6) {
            commentEl!.textContent = 'Nền tảng ổn. Đọc lại bài học phần liên quan rồi thử lại.';
        } else {
            commentEl!.textContent = 'Đừng nản — quay lại bài học, làm lại phần này từ đầu.';
        }

        box!.classList.add('show');
        box!.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function retakeSection(sectionKey: string) {
        SECTIONS[sectionKey as keyof typeof SECTIONS].ids.forEach(qId => {
            delete answered.current[qId];
            const block = document.getElementById(qId);
            if (!block) return;
            block.querySelectorAll('.option').forEach(o => { o.className = 'option'; });
            const fb = document.getElementById('fb-' + qId);
            if (!fb) return;
            fb.className = 'answer-feedback';
            fb.textContent = '';
            (block.querySelector('.check-btn') as HTMLButtonElement).disabled = false;
            block.classList.remove('question-unanswered');
        });
        scores.current[sectionKey as keyof typeof scores.current] = 0;
        document.getElementById('quiz-result-' + sectionKey)!.classList.remove('show');
        document.getElementById('section-' + sectionKey)!.scrollIntoView({ behavior: 'smooth' });
        resetTotalScoreHint();
        setShowAnswers(false);
    }

    function getAllQuestionIds(): string[] {
        return SECTIONS.basic.ids.concat(SECTIONS.advanced.ids);
    }

    function setShowAnswers(show: boolean) {
        quizAnswersVisible.current = show;
        const btn = document.getElementById('btn-toggle-answers');
        getAllQuestionIds().forEach(function (qId) {
            const block = document.getElementById(qId);
            if (!block) return;
            const correctVal = answers[qId as keyof typeof answers];
            block.querySelectorAll('.option').forEach(function (o) {
                o.classList.remove('option-answer-key');
                if (show && o.getAttribute('data-val') === correctVal) {
                    o.classList.add('option-answer-key');
                }
            });
        });
        if (btn) {
            btn.textContent = show ? 'Ẩn đáp án' : 'Xem đáp án';
            btn.classList.toggle('is-active', !!show);
            btn.setAttribute('aria-pressed', show ? 'true' : 'false');
        }
    }

    function toggleShowAnswers() {
        setShowAnswers(!quizAnswersVisible.current);
    }

    function resetTotalScoreHint() {
        const el = document.getElementById('quiz-total-score');
        if (!el) return;
        el.classList.add('is-empty');
        el.textContent = 'Bấm “Chấm điểm” để xem tổng kết toàn bài.';
    }

    function gradeEntireQuiz() {
        const ids = getAllQuestionIds();
        const missing: string[] = [];
        ids.forEach(function (qId) {
            const block = document.getElementById(qId);
            if (!block) return;
            if (!block.querySelector('.option.selected')) {
                missing.push(qId);
                block.classList.add('question-unanswered');
            } else {
                block.classList.remove('question-unanswered');
            }
        });
        if (missing.length > 0) {
            alert(
                'Vẫn còn ' +
                missing.length +
                ' câu chưa chọn đáp án.\n\nVui lòng chọn đáp án cho đủ tất cả câu hỏi rồi mới bấm Chấm điểm.\n\nCác câu chưa trả lời đã được tô đỏ trên danh sách.'
            );
            const first = document.getElementById(missing[0]);
            if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        const total = ids.length;
        let correct = 0;
        ids.forEach(function (qId) {
            const block = document.getElementById(qId);
            if (!block) return;
            const selected = block.querySelector('.option.selected');
            if (!selected) return;
            const userVal = selected.getAttribute('data-val');
            if (userVal === answers[qId as keyof typeof answers]) correct++;
        });
        const el = document.getElementById('quiz-total-score');
        if (el) {
            el.classList.remove('is-empty');
            el.textContent = 'Số câu trả lời đúng / tổng số câu: ' + correct + ' / ' + total;
        }
        const wrap = document.getElementById('quiz-final-grade');
        if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    useEffect(() => {
        const shell = document.getElementById('quiz-shell');
        const scrollEl = document.querySelector('.quiz-shell-scroll');
        const openBtn = document.getElementById('btn-open-quiz');
        const closeBar = document.getElementById('btn-close-quiz-bar');
        const backLink = document.getElementById('back-to-lecture');

        const closeQuiz = () => {
            if (!shell) return;
            shell.classList.remove('is-open');
            shell.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            const anchor = document.getElementById('ket-bai-giang');
            if (anchor) {
                anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        const openQuiz = () => {
            if (!shell) return;
            shell.classList.add('is-open');
            shell.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (scrollEl) scrollEl.scrollTop = 0;
        }

        if (openBtn) openBtn.addEventListener('click', openQuiz);
        if (closeBar) closeBar.addEventListener('click', closeQuiz);
        if (backLink) {
            backLink.addEventListener('click', function (e) {
                e.preventDefault();
                closeQuiz();
            });
        }
    }, [])
    return (
        <Fragment>
            <div className="page-wrapper" id="phan-bai-giang">
                <div className="header" id="cover">
                    <div className="header-badge">Tài liệu đào tạo · IT cho người mới</div>
                    <h1>Hiểu hệ thống từ góc nhìn User</h1>
                    <p className="header-sub">Khung tư duy phân tích dự án,</p>
                    <p className="header-sub">định hướng cách tìm hiểu hệ thống và nắm bắt dự án nhanh hơn trong giai đoạn đầu.</p>
                    <p className="header-trainer">Quỳnh Nga BrSE Japan — Đồng Hành Cùng Bạn</p>
                    <p className="header-meta">Dành cho người mới · ~35 phút · 5 phần nội dung · Thực hành với LMS</p>
                </div>

                <section id="theory">
                    <div className="card">
                        <div className="section-label">Mục tiêu</div>
                        <div className="section-title">Sau bài này, bạn sẽ làm được gì?</div>
                        <p className="section-desc">Bài học này không đi theo hướng kỹ thuật. Thay vào đó, mình bắt đầu từ góc nhìn người dùng — cách tiếp cận dễ hiểu nhất cho người mới.</p>

                        <div className="lesson-block">
                            <div className="block-title">Bạn sẽ đạt được</div>
                            <p className="memory-visual-caption" style={{ marginBottom: '4px' }}>Năng lực đầu ra — tương ứng khung 5 bước phân tích (đọc từng ô dưới đây)</p>
                            <div className="outcomes-hub" role="img" aria-label="Sơ đồ năng lực đầu ra sau bài học">
                                <div className="out-pill">
                                    <span className="out-emoji" aria-hidden="true">🎯</span>
                                    <div className="out-name">Khái quát hệ thống</div>
                                    <div className="out-hint">Hệ thống làm gì · mấy portal · Web/App/CMS · tích hợp (nếu có)</div>
                                </div>
                                <div className="out-pill">
                                    <span className="out-emoji" aria-hidden="true">👥</span>
                                    <div className="out-name">Role</div>
                                    <div className="out-hint">Liệt kê role · xác định primary user(s)</div>
                                </div>
                                <div className="out-pill">
                                    <span className="out-emoji" aria-hidden="true">📋</span>
                                    <div className="out-name">Function / Screen</div>
                                    <div className="out-hint">Lập list theo từng role — không trộn role</div>
                                </div>
                                <div className="out-pill">
                                    <span className="out-emoji" aria-hidden="true">🔀</span>
                                    <div className="out-name">User flow</div>
                                    <div className="out-hint">Chọn 1 role ưu tiên · mô tả 1–2 luồng chính (mũi tên A→B→C)</div>
                                </div>
                                <div className="out-pill">
                                    <span className="out-emoji" aria-hidden="true">📖</span>
                                    <div className="out-name">Glossary &amp; Q&A</div>
                                    <div className="out-hint">Thuật ngữ JP/VI · list câu hỏi cần hỏi lại team/KH</div>
                                </div>
                                <div className="out-pill">
                                    <span className="out-emoji" aria-hidden="true">📊</span>
                                    <div className="out-name">Template Excel</div>
                                    <div className="out-hint">Áp dụng cùng khung cho dự án thật của bạn</div>
                                </div>
                            </div>
                            <p className="outcomes-hub-note">Không cần biết code — chỉ cần hệ thống hóa theo các mục trên.</p>
                        </div>

                        <div className="lesson-block">
                            <div className="block-title">Lộ trình bài học — 5 phần</div>
                            <div className="flow-visual">
                                <span className="flow-step">① Khái quát hệ thống</span>
                                <span className="flow-arrow">→</span>
                                <span className="flow-step">② Role</span>
                                <span className="flow-arrow">→</span>
                                <span className="flow-step">③ Function / Screen list</span>
                                <span className="flow-arrow">→</span>
                                <span className="flow-step">④ User Flow &amp; Screen Detail</span>
                                <span className="flow-arrow">→</span>
                                <span className="flow-step">⑤ Glossary &amp; Q&A </span>
                            </div>
                            <div className="lms-banner">
                                <span className="lms-icon">🎓</span>
                                <div>
                                    <strong>Case study xuyên suốt: Hệ thống LMS (Learning Management System)</strong>
                                    <span>Hệ thống học tập đào tạo trực tuyến — dùng làm ví dụ minh họa cho cả 5 phần nội dung.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*=========== PHẦN 1: KHÁI QUÁT HỆ THỐNG ===========*/}
                    <div className="card">
                        <div className="phase-badge">Phần 1</div>
                        <div className="section-title">Khái quát hệ thống</div>
                        <div className="lesson-block">
                            <div className="block-subtitle">Khung tư duy</div>
                            <p className="mindframe-intro">
                                Mới tìm hiểu một hệ thống, hãy đi <strong>từ tổng quan</strong> trước — chưa cần vào từng màn hình hay chức năng. Ba nhóm câu hỏi dưới đây (A → B → C) giúp bạn
                                “định vị” hệ thống trong vài phút.
                            </p>
                            <div className="mindframe-flow">
                                <span>① Mục đích</span>
                                <span className="mf-arrow">→</span>
                                <span>② Portal &amp; Web/App/CMS</span>
                                <span className="mf-arrow">→</span>
                                <span>③ Tích hợp</span>
                            </div>
                            <div className="block-title" style={{ marginTop: '18px' }}>A. Mục đích hệ thống</div>
                            <table className="mapping-table mindframe-table">
                                <thead>
                                <tr>
                                    <th>Câu hỏi</th>
                                    <th>Ý nghĩa</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="role-cell">Hệ thống này là gì? Làm gì?</td>
                                    <td>Loại hệ thống (LMS, EC, CRM…) và <strong>mục đích tổng thể</strong> — giải quyết vấn đề gì cho doanh nghiệp / tổ chức?</td>
                                </tr>
                                </tbody>
                            </table>
                            <div className="block-title" style={{ marginTop: '20px' }}>B. Portal — Hệ thống có những cổng nào?</div>
                            <div className="callout callout-amber">
                                <strong>Làm rõ thuật ngữ:</strong><br/>
                                • <strong>Portal</strong> = <em>cổng truy cập</em> theo nhóm đối tượng (Admin portal, User portal…) — thường URL hoặc app riêng.<br/>
                                • <strong>Web / App / CMS</strong> = <em>hình thức</em> triển khai portal — không thay thế nhau.<br/>
                                • <strong>CMS</strong> thường nằm trong <strong>Admin portal</strong> — soạn, đăng nội dung; không phải cổng cho người dùng cuối.
                            </div>
                            <div className="diagram-grid">
                                <div className="diagram-card admin">
                                    <h4>🔧 Admin Portal</h4>
                                    <p>Dành cho vận hành và quản trị hệ thống. Thường là Web trên PC; có thể kèm CMS để soạn &amp; đăng nội dung, cấu hình hệ thống.</p>
                                </div>
                                <div className="diagram-card user">
                                    <h4>📱 User Portal</h4>
                                    <p>Người dùng cuối (học, mua hàng…). Hay có <strong>Web</strong> + <strong>Mobile App</strong>.</p>
                                </div>
                            </div>
                            <div className="platform-row">
                                <div className="platform-chip">
                                    <span className="icon">🖥️</span>
                                    <div><strong>Web</strong><br/><span style={{ fontWeight:400, fontSize: '12px' }}>Trình duyệt — PC hoặc mobile</span></div>
                                </div>
                                <div className="platform-chip">
                                    <span className="icon">📱</span>
                                    <div><strong>Mobile App</strong><br/><span style={{ fontWeight:400, fontSize: '12px' }}>Cài từ Store — iOS / Android</span></div>
                                </div>
                                <div className="platform-chip">
                                    <span className="icon">📝</span>
                                    <div><strong>CMS</strong><br/><span style={{ fontWeight:400, fontSize: '12px' }}>Soạn / đăng nội dung — thường trong Admin</span></div>
                                </div>
                            </div>
                            <div className="golden-question" style={{ marginTop: '16px' }}>
                                <p>Câu hỏi vàng (Portal)</p>
                                <strong>“Hệ thống có mấy portal? Mỗi portal ai vào, bằng Web hay App?”</strong>
                            </div>
                            <div className="block-title" style={{ marginTop: '24px' }}>C. Tích hợp — Có kết nối hệ thống khác không?</div>
                            <p className="mindframe-intro"  style={{ marginTop: '8px' }}>
                                Ngoài chức năng “bên trong”, nhiều hệ thống còn <strong>kết nối với hệ thống khác</strong> để chia sẻ dữ liệu hoặc dùng dịch vụ sẵn có — đó gọi là <strong>tích
                                hợp (integration)</strong>.
                            </p>
                            <div className="integration-questions">
                                <div className="integration-q-card">
                                    <strong>Có tích hợp không?</strong>
                                    <span>Liệt kê tên các hệ thống bên ngoài hoặc nội bộ mà hệ thống hiện tại kết nối (API, SSO, import file…).</span>
                                </div>
                                <div className="integration-q-card">
                                    <strong>Hệ thống đó là gì?</strong>
                                    <span>Ghi <em>khái quát</em> 1–2 câu: đó là loại hệ thống gì (HRM, thanh toán, học trực tuyến…).</span>
                                </div>
                                <div className="integration-q-card">
                                    <strong>Internal hay External?</strong>
                                    <span><strong>Internal</strong> — cùng tổ chức, do công ty tự vận hành. <strong>External</strong> — bên thứ ba (Udemy, VNPay…).</span>
                                </div>
                                <div className="integration-q-card">
                                    <strong>Mục đích tích hợp?</strong>
                                    <span>Tại sao phải kết nối? VD: đồng bộ nhân sự, thu học phí, import khóa học có sẵn.</span>
                                </div>
                            </div>
                            <div className="callout callout-green" style={{ marginTop: '14px' }}>
                                <strong>Mẹo BrSE:</strong> Không phải hệ thống nào cũng có tích hợp. Nếu chưa thấy → ghi <em>(Cần xác nhận)</em> và hỏi PM/khách hàng.
                            </div>
                            <div className="golden-question" style={{ marginTop: '16px' }}>
                                <p>Câu hỏi vàng (Tích hợp)</p>
                                <strong>“Hệ thống có tích hợp với hệ thống nào? Internal hay External — để làm gì?”</strong>
                            </div>
                        </div>
                        <div className="lesson-block">
                            <div className="block-subtitle">Ví dụ</div>
                            <div className="block-title">LMS — Khái quát hệ thống</div>
                            <p className="section-desc">
                                <strong>LMS</strong> — quản lý và cung cấp đào tạo trực tuyến. <strong>Mục đích doanh nghiệp:</strong> kết nối người dạy — người học — đơn vị đào tạo trên một nền
                                tảng số.
                            </p>
                            <table className="mapping-table">
                                <thead>
                                <tr>
                                    <th>Portal</th>
                                    <th>Web / App / CMS</th>
                                    <th>Ai dùng (sơ bộ)</th>
                                    <th>Làm gì?</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="role-cell">Admin Portal</td>
                                    <td><span className="tag tag-blue">Web</span> <span className="tag tag-blue">CMS</span></td>
                                    <td>Admin, School, Teacher</td>
                                    <td>Quản trị, quản lý khóa/lớp, soạn &amp; đăng bài, chấm điểm</td>
                                </tr>
                                <tr>
                                    <td className="role-cell">User Portal</td>
                                    <td><span className="tag tag-green">Web</span> <span className="tag tag-green">Mobile App</span></td>
                                    <td>Học viên</td>
                                    <td>Học bài, làm quiz, nộp bài, xem điểm</td>
                                </tr>
                                </tbody>
                            </table>
                            <div className="system-tree" style={{ marginTop: '14px' }}>
                                <strong>LMS — Sơ đồ Portal</strong><br/>
                                Hệ thống LMS<br/>
                                ├── <strong>Admin Portal</strong> (Web + CMS)<br/>
                                │&nbsp;&nbsp;&nbsp;└── Admin · School · Teacher<br/>
                                └── <strong>User Portal</strong><br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;├── Web → Học viên<br/>
                                &nbsp;&nbsp;&nbsp;&nbsp;└── Mobile App → Học viên
                            </div>
                            <div className="block-title" style={{ marginTop: '20px' }}>LMS — Tích hợp</div>
                            <p className="section-desc">Ví dụ một LMS doanh nghiệp có thể kết nối các hệ thống sau:</p>
                            <table className="mapping-table integration-table">
                                <thead>
                                <tr>
                                    <th>Hệ thống tích hợp</th>
                                    <th>Khái quát</th>
                                    <th>Mục đích tích hợp</th>
                                    <th>Internal / External</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="role-cell">Hệ thống HRM</td>
                                    <td>Hệ thống quản lý nhân sự</td>
                                    <td>Đồng bộ danh sách nhân viên / học viên nội bộ, phòng ban, chức danh — tránh nhập tay trùng lặp</td>
                                    <td><span className="tag tag-internal">Internal</span></td>
                                </tr>
                                <tr>
                                    <td className="role-cell">Udemy</td>
                                    <td>Hệ thống học tập trực tuyến</td>
                                    <td>Import hoặc liên kết khóa học có sẵn từ nền tảng bên ngoài vào LMS</td>
                                    <td><span className="tag tag-external">External</span></td>
                                </tr>
                                <tr>
                                    <td className="role-cell">Coursera</td>
                                    <td>Hệ thống học tập trực tuyến</td>
                                    <td>Mở rộng thư viện khóa học — học viên học nội dung Coursera qua cổng LMS</td>
                                    <td><span className="tag tag-external">External</span></td>
                                </tr>
                                <tr>
                                    <td className="role-cell">VNPay</td>
                                    <td>Hệ thống thanh toán</td>
                                    <td>Thu học phí, phí đăng ký khóa học trực tuyến an toàn</td>
                                    <td><span className="tag tag-external">External</span></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card">
                        <div className="phase-badge">Phần 2</div>
                        <div className="section-title">System Role</div>
                        <p className="section-desc"><strong>Role</strong> = vai trò người dùng trong hệ thống. Mỗi Role có quyền hạn và công việc khác nhau — phân tích đúng Role giúp bạn
                            không “trộn” chức năng của Admin với Học viên.</p>

                        <div className="lesson-block">
                            <div className="block-subtitle">Khung tư duy</div>
                            <div className="block-title">Cách xác định Role</div>
                            <ul className="bullets">
                                <li>Liệt kê <strong>tất cả đối tượng</strong> có tài khoản hoặc truy cập hệ thống</li>
                                <li>Mỗi đối tượng → gán <strong>1 Role</strong> (có thể có Role phụ: Teacher thường vs Teacher Leader)</li>
                                <li>Đánh dấu <strong>Primary user(s)</strong> — có thể nhiều nhóm (VD LMS: <strong>Học viên</strong> trên User portal và <strong>Teacher</strong> trên Admin
                                    portal)
                                </li>
                            </ul>
                            <div className="callout callout-amber">
                                <strong>Lưu ý:</strong> Role ≠ Job title ngoài đời. Trong hệ thống, cùng một người có thể có nhiều Role — nhưng khi phân tích function, hãy tách từng Role riêng.
                            </div>
                        </div>

                        <div className="lesson-block">
                            <div className="block-subtitle">Ví dụ</div>
                            <div className="block-title">4 Role chính trong hệ thống LMS</div>

                            <div className="role-cards">
                                <div className="role-card">
                                    <div className="role-icon">🛡️</div>
                                    <div className="role-name">Admin</div>
                                    <div className="role-desc">Quản trị toàn hệ thống: cấu hình, phân quyền, bảo trì dữ liệu master.</div>
                                </div>
                                <div className="role-card">
                                    <div className="role-icon">🏫</div>
                                    <div className="role-name">School</div>
                                    <div className="role-desc">Đơn vị đào tạo: quản lý khóa học, lớp, học viên và giáo viên thuộc trường.</div>
                                </div>
                                <div className="role-card">
                                    <div className="role-icon">👩‍🏫</div>
                                    <div className="role-name">Teacher</div>
                                    <div className="role-desc">
                                        <strong>Teacher thường:</strong> Dạy lớp, soạn bài, chấm điểm.<br/>
                                        <strong>Teacher Leader:</strong> Thêm quyền duyệt bài giảng, quản lý nhóm giáo viên.<br/>
                                        <strong>Primary user</strong> (Admin portal) — trải nghiệm dạy / soạn / chấm.
                                    </div>
                                </div>
                                <div className="role-card">
                                    <div className="role-icon">🎒</div>
                                    <div className="role-name">Học viên</div>
                                    <div className="role-desc">Người học — <strong>Primary user</strong> (User portal): trải nghiệm học tập là trọng tâm phía học viên.</div>
                                </div>
                            </div>

                            <table className="mapping-table" style={{ marginTop: '16px' }}>
                                <thead>
                                <tr>
                                    <th>Role</th>
                                    <th>Mô tả ngắn</th>
                                    <th>Primary user?</th>
                                    <th>Ghi chú</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="role-cell">Admin</td>
                                    <td>Vận hành & cấu hình hệ thống cấp cao nhất</td>
                                    <td>Không</td>
                                    <td>Ít người, quyền cao nhất</td>
                                </tr>
                                <tr>
                                    <td className="role-cell">School</td>
                                    <td>Đại diện trường / trung tâm đào tạo</td>
                                    <td>Không</td>
                                    <td>Quản lý trong phạm vi trường mình</td>
                                </tr>
                                <tr>
                                    <td className="role-cell">Teacher</td>
                                    <td>Giáo viên giảng dạy trên LMS</td>
                                    <td><strong>Có ✓</strong></td>
                                    <td>Có 2 cấp: Teacher thường &amp; Teacher Leader. <strong>Teacher</strong> là đối tượng trải nghiệm chính trên Admin Site.</td>
                                </tr>
                                <tr>
                                    <td className="role-cell">Học viên</td>
                                    <td>Người tham gia khóa học, học và làm bài</td>
                                    <td><strong>Có ✓</strong></td>
                                    <td>Đối tượng trải nghiệm chính của User Site</td>
                                </tr>
                                </tbody>
                            </table>

                            <div className="system-tree">
                                <strong>LMS — Sơ đồ Role</strong><br/>
                                System LMS<br/>
                                ├── <strong>Admin</strong> — toàn hệ thống<br/>
                                ├── <strong>School</strong> — theo đơn vị đào tạo<br/>
                                ├── <strong>Teacher</strong> — Primary user (Admin portal) ★<br/>
                                │&nbsp;&nbsp;&nbsp;├── Teacher thường (giảng dạy)<br/>
                                │&nbsp;&nbsp;&nbsp;└── Teacher Leader (duyệt + giám sát)<br/>
                                └── <strong>Học viên</strong> — Primary user (User portal) ★
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="phase-badge">Phần 3</div>
                        <div className="section-title">Function list & Screen list</div>
                        <p className="section-desc">Sau Khái quát và Role — liệt kê <strong>tổng quan</strong> những gì mỗi Role làm được (Function) và màn hình tương ứng (Screen). Chưa cần
                            mô tả chi tiết từng luồng — việc đó ở Phần 4.</p>

                        <div className="lesson-block">
                            <div className="block-subtitle">Khung tư duy</div>
                            <div className="block-title">Function vs Screen — Quy tắc đơn giản</div>
                            <table className="mapping-table">
                                <thead>
                                <tr>
                                    <th>Khái niệm</th>
                                    <th>Định nghĩa</th>
                                    <th>Ví dụ LMS</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="role-cell">Function</td>
                                    <td>1 hành động user có thể thực hiện</td>
                                    <td>Đăng nhập, Xem bài giảng, Nộp bài tập, Chấm điểm</td>
                                </tr>
                                <tr>
                                    <td className="role-cell">Screen</td>
                                    <td>Màn hình hiển thị khi thực hiện function (thường 1 function → 1 screen chính)</td>
                                    <td>Login screen, Lesson detail screen, Submit assignment screen</td>
                                </tr>
                                </tbody>
                            </table>
                            <div className="callout callout-amber">
                                <strong>Quy tắc vàng:</strong> Viết function list <strong>theo từng Role</strong> — không trộn Admin với Học viên trong cùng một bảng.
                            </div>
                        </div>

                        <div className="lesson-block">
                            <div className="block-subtitle">Ví dụ</div>
                            <div className="block-title">Bảng Function list theo Role (LMS)</div>

                            <table className="mapping-table">
                                <thead>
                                <tr>
                                    <th style={{ width: '18%' }}>Role</th>
                                    <th>Function list (chức năng chính)</th>
                                    <th style={{ width: '28%' }}>Screen list (màn hình tiêu biểu)</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="role-cell">Admin</td>
                                    <td>
                                        <ul className="func-list">
                                            <li>Login / Logout</li>
                                            <li>Quản lý tài khoản & phân quyền (User management)</li>
                                            <li>Cấu hình hệ thống (System settings)</li>
                                            <li>Quản lý master data (khóa học template, danh mục)</li>
                                            <li>Xem log & báo cáo tổng hợp</li>
                                        </ul>
                                    </td>
                                    <td>Login, User list, Permission settings, System config, Dashboard admin</td>
                                </tr>
                                <tr>
                                    <td className="role-cell">School</td>
                                    <td>
                                        <ul className="func-list">
                                            <li>Quản lý thông tin trường / trung tâm</li>
                                            <li>Tạo & quản lý khóa học, lớp học</li>
                                            <li>Đăng ký / gán học viên, giáo viên vào lớp</li>
                                            <li>Xem báo cáo tiến độ theo trường</li>
                                        </ul>
                                    </td>
                                    <td>School profile, Course list, Class management, Enrollment, School report</td>
                                </tr>
                                <tr>
                                    <td className="role-cell">Teacher</td>
                                    <td>
                                        <ul className="func-list">
                                            <li>Đăng ký / upload bài giảng (Lesson register)</li>
                                            <li>Soạn nội dung bài học (video, slide, tài liệu)</li>
                                            <li>Giao bài tập & quiz cho lớp</li>
                                            <li>Chấm điểm & phản hồi bài nộp</li>
                                            <li>Xem danh sách & tiến độ học viên trong lớp</li>
                                        </ul>
                                    </td>
                                    <td>My classes, Lesson editor, Assignment create, Grading screen, Student progress</td>
                                </tr>
                                <tr>
                                    <td className="role-cell">Teacher Leader</td>
                                    <td>
                                        <ul className="func-list">
                                            <li>Tất cả function của Teacher, cộng thêm:</li>
                                            <li>Duyệt / từ chối bài giảng của giáo viên (Approve lesson)</li>
                                            <li>Quản lý nhóm giáo viên (Team management)</li>
                                            <li>Xem báo cáo chất lượng giảng dạy</li>
                                        </ul>
                                    </td>
                                    <td>Lesson approval queue, Teacher team list, Quality report</td>
                                </tr>
                                <tr>
                                    <td className="role-cell">Học viên</td>
                                    <td>
                                        <ul className="func-list">
                                            <li>Đăng ký / Đăng nhập</li>
                                            <li>Xem danh sách khóa học đã đăng ký</li>
                                            <li>Xem bài giảng (video, tài liệu)</li>
                                            <li>Làm quiz & nộp bài tập</li>
                                            <li>Xem điểm, tiến độ, chứng chỉ</li>
                                        </ul>
                                    </td>
                                    <td>Login, My courses, Lesson player, Quiz / Submit, Grade & certificate</td>
                                </tr>
                                </tbody>
                            </table>

                            <div className="callout callout-purple">
                                <strong>Gợi ý:</strong> Bảng trên là <strong>danh sách tổng quan</strong> theo Role. Phần 4 — chọn <strong>1 role ưu tiên</strong> (thường là một trong các
                                primary user) và mô tả <strong>1–2 user flow</strong> chính ở mức khái quát.
                            </div>
                        </div>
                    </div>

                    {/*=========== PHẦN 4: USER FLOW & SCREEN DETAIL ===========*/}
                    <div className="card">
                        <div className="phase-badge">Phần 4</div>
                        <div className="section-title">User Flow &amp; Screen Detail</div>
                        <p className="section-desc">Mô tả <strong>1–2 user flow</strong> tiêu biểu — của <strong>1 role bạn chọn làm ưu tiên</strong> khi onboard (có thể là một trong
                            các <em>primary user</em> của hệ thống). Đây là bước “đi vào thực tế” sau khi đã có function/screen list tổng quan. <strong>Screen Detail</strong> (mô tả sâu từng
                            màn hình) làm thêm khi dự án yêu cầu tài liệu chi tiết — không bắt buộc ở mức khái quát trong bài này.</p>

                        <div className="lesson-block">
                            <div className="block-subtitle">Khung tư duy</div>
                            <p className="mindframe-intro">
                                Ở giai đoạn <strong>khái quát</strong>, bạn <em>không cần</em> mô tả hết mọi luồng và mọi màn hình. Hãy chọn lọc:
                            </p>
                            <ul className="bullets">
                                <li><strong>1 Role ưu tiên</strong> — chọn trước một role để đào sâu (VD LMS: thường bắt đầu từ <strong>Học viên</strong> hoặc <strong>Teacher</strong> — cả hai
                                    đều là primary user trên hai cổng khác nhau).
                                </li>
                                <li><strong>1–2 User flow chính</strong> — chuỗi bước user làm để hoàn thành <em>1 nhiệm vụ nghiệp vụ quan trọng</em> (VD: hoàn thành 1 bài học; chấm 1 bài tập).
                                </li>
                            </ul>
                            <table className="mapping-table" style={{ marginTop: '14px' }}>
                                <thead>
                                <tr>
                                    <th>Khái niệm</th>
                                    <th>Ý nghĩa</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="role-cell">User Flow</td>
                                    <td>Chuỗi bước user đi qua để xong <strong>1 việc</strong> — viết dạng mũi tên: A → B → C</td>
                                </tr>
                                <tr>
                                    <td className="role-cell">Screen Detail</td>
                                    <td>Khi cần: mô tả chi tiết 1 màn hình (field, nút, rule) — thường dùng ở giai đoạn spec / tài liệu chi tiết, không gói gọn trong phần khái quát này.</td>
                                </tr>
                                </tbody>
                            </table>
                            <div className="callout callout-amber" style={{ marginTop: '14px' }}>
                                <strong>Khi nào làm chi tiết hơn?</strong> Nếu thời gian tìm hiểu dự án <strong>dài</strong> và được yêu cầu <strong>tài liệu chi tiết</strong> (spec đầy đủ, test
                                case…) — lúc đó mới mở rộng thêm flow và <strong>Screen Detail</strong>. Ở bài này, <strong>1–2 user flow</strong> khái quát là đủ để onboard nhanh.
                            </div>
                            <div className="golden-question" style={{ marginTop: '16px' }}>
                                <p>Câu hỏi vàng</p>
                                <strong>“Role nào mình ưu tiên đào sâu trước? 1–2 việc họ làm nhiều nhất là gì — và luồng tương ứng là gì?”</strong>
                            </div>
                        </div>

                        <div className="lesson-block">
                            <div className="block-subtitle">Ví dụ</div>
                            <div className="block-title">LMS — User Flow (mức khái quát)</div>
                            <p className="section-desc">VD LMS có hai nhóm <strong>primary user</strong> — dưới đây minh hoạ <strong>hai user flow</strong> tương ứng (không cần mô tả Screen
                                Detail trong bài này).</p>
                            <div className="role-pick">Role: Học viên ★ (Primary user — User portal)</div>

                            <div className="subsection-bar">User flow tiêu biểu (của 1 role cần tìm hiểu trước)</div>
                            <p className="section-desc" style={{ marginTop: 0 }}>Viết <strong>1–2</strong> luồng chính — không cần liệt kê hết mọi thao tác trong hệ thống.</p>

                            <p className="flow-label">User flow 1: Học viên hoàn thành 1 bài học</p>
                            <div className="flow-visual">
                                <span className="flow-step">Login</span>
                                <span className="flow-arrow">→</span>
                                <span className="flow-step">My courses</span>
                                <span className="flow-arrow">→</span>
                                <span className="flow-step">Chọn bài giảng</span>
                                <span className="flow-arrow">→</span>
                                <span className="flow-step">Xem video</span>
                                <span className="flow-arrow">→</span>
                                <span className="flow-step">Làm quiz</span>
                                <span className="flow-arrow">→</span>
                                <span className="flow-step">Xem điểm</span>
                            </div>

                            <p className="flow-label" style={{ marginTop: '18px' }}>User flow 2: Teacher chấm 1 bài tập</p>
                            <p className="section-desc" style={{ marginTop: '13px', marginBottom: '8px' }}>Luồng thứ hai minh hoạ primary user phía <strong>Admin portal</strong> (cùng quan trọng với
                                luồng học viên — tuỳ giai đoạn dự án mà bạn đào sâu trước).</p>
                            <div className="role-pick" style={{ background: '#EDE9FE', color: '#5B21B6' }}>Role: Teacher ★ (Primary user — Admin portal)</div>
                            <div className="flow-visual">
                                <span className="flow-step">Login</span>
                                <span className="flow-arrow">→</span>
                                <span className="flow-step">My classes</span>
                                <span className="flow-arrow">→</span>
                                <span className="flow-step">Danh sách bài nộp</span>
                                <span className="flow-arrow">→</span>
                                <span className="flow-step">Màn chấm điểm</span>
                                <span className="flow-arrow">→</span>
                                <span className="flow-step">Gửi điểm &amp; feedback</span>
                            </div>

                        </div>
                    </div>

                    {/*=========== PHẦN 5: GLOSSARY & ĐIỂM CẦN XÁC NHẬN ===========*/}
                    <div className="card">
                        <div className="phase-badge">Phần 5</div>
                        <div className="section-title">Glossary &amp; Điểm cần xác nhận</div>
                        <p className="section-desc">Bước cuối khi tìm hiểu hệ thống — đặc biệt quan trọng khi làm dự án <strong>Nhật Bản / nước ngoài</strong>: gom thuật ngữ và những gì
                            bạn <strong>chưa chắc</strong> vào một chỗ, sẵn sàng hỏi khách hàng hoặc team.</p>

                        <div className="lesson-block">
                            <div className="block-subtitle">Khung tư duy</div>

                            <div className="block-title">A. Glossary — Bảng thuật ngữ dự án</div>
                            <p className="mindframe-intro" style={{ marginBottom: '12px' }}>
                                Tài liệu, màn hình, họp kick-off thường dùng thuật ngữ nghiệp vụ hoặc tiếng Nhật. Bạn cần một <strong>bảng thuật ngữ (Glossary)</strong> để đọc hiểu ngay từ đầu —
                                không phải tra cứu rời rạc mỗi lần gặp từ mới.
                            </p>
                            <ul className="bullets">
                                <li><strong>Lấy từ đâu?</strong> Tài liệu dự án có sẵn (BRD, spec, slide), màn hình hệ thống, biên bản họp, email khách hàng.</li>
                                <li><strong>Có thể dùng AI</strong> hỗ trợ liệt kê &amp; giải thích — nhưng <em>luôn đối chiếu</em> với tài liệu chính thức hoặc hỏi lại PM/BrSE.</li>
                                <li><strong>Cột gợi ý:</strong> Thuật ngữ (JP/EN) · Tiếng Việt · Ghi chú / ví dụ trong hệ thống.</li>
                            </ul>

                            <div className="block-title" style={{ marginTop: '20px' }}>B. Điểm cần xác nhận</div>
                            <p className="mindframe-intro" style={{ marginBottom: '12px' }}>
                                Trong quá trình phân tích (Phần 1–4), bạn sẽ gặp chỗ <strong>chưa rõ, chưa hiểu, hoặc tài liệu mâu thuẫn</strong>. Đừng bỏ qua — ghi hết vào <strong>một mục “Điểm
                                cần xác nhận”</strong>.
                            </p>
                            <ul className="bullets">
                                <li>Mỗi dòng = một câu hỏi / một giả định cần khách hàng hoặc team xác nhận.</li>
                                <li>Khi <strong>trình bày lại hiểu biết</strong> (walkthrough, onboarding) → dùng list này để hỏi luôn, tránh hiểu sai sang giai đoạn spec/test.</li>
                                <li>Gợi ý ghi kèm: <em>hỏi ai</em> (PM, khách hàng, dev) · <em>ưu tiên</em> (cao / trung bình).</li>
                            </ul>
                            <div className="callout callout-green">
                                <strong>Thói quen BrSE:</strong> Glossary và Điểm cần xác nhận cập nhật <strong>liên tục</strong> — không chỉ làm một lần rồi bỏ quên.
                            </div>
                        </div>

                        <div className="lesson-block">
                            <div className="block-subtitle">Ví dụ</div>
                            <div className="block-title">LMS — Glossary &amp; Điểm cần xác nhận (mẫu)</div>

                            <p className="section-desc" style={{ marginBottom: '10px' }}><strong>Glossary</strong> — một phần thuật ngữ thường gặp:</p>
                            <table className="mapping-table glossary-table">
                                <thead>
                                <tr>
                                    <th>Thuật ngữ (JP)</th>
                                    <th>Tiếng Việt</th>
                                    <th>Ghi chú / ví dụ trong LMS</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td className="jp-term">コース</td>
                                    <td>Khóa học</td>
                                    <td>Đơn vị đào tạo lớn — gồm nhiều bài giảng / module</td>
                                </tr>
                                <tr>
                                    <td className="jp-term">授業・レッスン</td>
                                    <td>Bài giảng</td>
                                    <td>Lesson — video, slide, tài liệu học</td>
                                </tr>
                                <tr>
                                    <td className="jp-term">受講</td>
                                    <td>Đăng ký / tham gia học</td>
                                    <td>Enrollment — gán học viên vào khóa/lớp</td>
                                </tr>
                                <tr>
                                    <td className="jp-term">課題</td>
                                    <td>Bài tập</td>
                                    <td>Assignment — học viên nộp, giáo viên chấm</td>
                                </tr>
                                <tr>
                                    <td className="jp-term">修了</td>
                                    <td>Hoàn thành khóa</td>
                                    <td>Course completion — đủ điều kiện cấp chứng chỉ</td>
                                </tr>
                                <tr>
                                    <td className="jp-term">受講者</td>
                                    <td>Học viên</td>
                                    <td>Learner — primary user (User portal); cùng <strong>Teacher</strong> là primary user (Admin portal) trong ví dụ LMS</td>
                                </tr>
                                <tr>
                                    <td className="jp-term">管理者</td>
                                    <td>Quản trị viên</td>
                                    <td>Admin — cấu hình hệ thống, phân quyền</td>
                                </tr>
                                </tbody>
                            </table>

                            <p className="section-desc" style={{ marginTop: '18px', marginBottom: '10px' }}><strong>Điểm cần xác nhận</strong> — ví dụ khi mới onboard LMS:</p>
                            <ul className="confirm-list">
                                <li><strong>Teacher Leader</strong> có tài khoản portal riêng hay dùng chung Admin portal với Teacher thường?</li>
                                <li>Học viên <strong>bắt buộc</strong> dùng Mobile App hay chỉ học trên Web cũng được?</li>
                                <li>Tích hợp <strong>Udemy / Coursera</strong>: đồng bộ khóa học tự động (API) hay import thủ công từng khóa?</li>
                                <li><strong>修了</strong> (hoàn thành khóa) được tính khi nào — đủ điểm quiz, hay phải xem hết 100% video?</li>
                                <li>Role <strong>School</strong> quản lý được bao nhiêu trường — một tenant hay nhiều trường con?</li>
                            </ul>
                            <div className="callout callout-amber" style={{ marginTop: '14px' }}>
                                <strong>Khi họp khách hàng:</strong> Mở file Excel → tab Glossary &amp; Điểm cần xác nhận → đi từng dòng. Đây là cách thể hiện bạn <em>chủ động</em> và <em>cẩn
                                thận</em> — rất được đánh giá cao ở dự án offshore.
                            </div>
                        </div>
                    </div>
                    {/*=========== TEMPLATE / THỰC HÀNH ===========*/}
                    <div className="card">
                        <div className="section-label">Áp dụng thực tế</div>
                        <div className="section-title">Template phân tích — Bước tiếp theo của bạn</div>
                        <p className="section-desc">Bài học vừa rồi là <strong>mẫu phân tích hoàn chỉnh</strong> cho LMS. Giờ hãy áp dụng cùng khung cho hệ thống bạn đang làm việc.</p>

                        <div className="lesson-block">
                            <div className="block-title">5 mục trong template Excel (sau bài học)</div>
                            <ul className="bullets">
                                <li><strong>1. Khái quát hệ thống</strong> — Mục đích; portal; Web/App/CMS; tích hợp (nếu có)</li>
                                <li><strong>2. Role</strong> — Ai dùng? Primary user là ai?</li>
                                <li><strong>3. Function / Screen list</strong> — Theo từng Role</li>
                                <li><strong>4. User Flow &amp; Screen Detail</strong> — 1 role ưu tiên; 1–2 flow khái quát; Screen Detail + ảnh khi dự án yêu cầu chi tiết</li>
                                <li><strong>5. Glossary & Điểm cần xác nhận</strong> — JP/VI; câu hỏi cần hỏi lại</li>
                                Checklist hoàn thành — Đủ 5 mục trên trước khi onboard
                            </ul>
                            <div className="callout callout-green">
                                <strong>Thực hành:</strong> Giảng viên sẽ cung cấp <strong>file Excel template</strong> — bạn điền cho dự án thật của mình. Mục tiêu: trong 1 tuần bạn có bản phân
                                tích đủ để onboard.
                            </div>
                        </div>
                    </div>
                </section>

                {/*=========== CLOSING ===========*/}
                <section id="closing">
                    <div className="closing">
                        <div className="section-label">Kết bài</div>
                        <div className="closing-title">Bạn đã có "đôi mắt" để nhìn hệ thống</div>
                        <p className="closing-text">Chỉ với <strong>5 bước</strong> — Khái quát hệ thống (mục đích / portal / tích hợp) → Role → Function list &amp; Screen list → User
                            Flow &amp; Screen Detail → Glossary &amp; Q&amp;A — bạn có thể phân tích bất kỳ hệ thống nào mà không cần biết code. Hãy luyện với LMS hôm nay, rồi điền template
                            Excel cho dự án thật của bạn.</p>

                        <div className="lesson-block">
                            <div className="block-title">5 bước chính cần nhớ — Sơ đồ tổng hợp</div>

                            <div className="memory-visual-wrap">
                                <p className="memory-visual-caption">Quy trình phân tích hệ thống từ góc nhìn User — đọc từ trái sang phải, theo thứ tự khi onboard dự án mới</p>

                                <svg className="memory-flow-svg" viewBox="0 0 900 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sơ đồ 5 bước phân tích hệ thống">
                                    <defs>
                                        <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" style={{ stopColor: '#1D4ED8', stopOpacity: 0.15 }}/>
                                            <stop offset="100%" style={{ stopColor: '#2D8B5E', stopOpacity:0.25 }}/>
                                        </linearGradient>
                                        <marker id="arrowHead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                                            <polygon points="0 0, 8 3, 0 6" fill="#94A3B8"/>
                                        </marker>
                                    </defs>
                                    <path d="M 90 100 H 810" stroke="url(#pathGrad)" strokeWidth="6" fill="none" strokeLinecap="round"/>
                                    <path d="M 90 100 H 810" stroke="#CBD5E1" strokeWidth="2" fill="none" strokeDasharray="6 4" markerEnd="url(#arrowHead)"/>
                                    <circle cx="90" cy="100" r="32" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
                                    <text x="90" y="92" textAnchor="middle" fontSize="20">&#127919;</text>
                                    <text x="90" y="128" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#92400E">
                                        <tspan x="90" dy="0">Khái quát hệ thống</tspan>
                                        <tspan x="90" dy="11">(mục đích · portal</tspan>
                                        <tspan x="90" dy="11">· tích hợp)</tspan>
                                    </text>
                                    <circle cx="270" cy="100" r="32" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2"/>
                                    <text x="270" y="92" textAnchor="middle" fontSize="20">&#128101;</text>
                                    <text x="270" y="148" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1D4ED8">Role</text>
                                    <circle cx="450" cy="100" r="32" fill="#DCFCE7" stroke="#22C55E" strokeWidth="2"/>
                                    <text x="450" y="92" textAnchor="middle" fontSize="20">&#128203;</text>
                                    <text x="450" y="142" textAnchor="middle" fontSize="9" fontWeight="700" fill="#166534">
                                        <tspan x="450" dy="0">Function list</tspan>
                                        <tspan x="450" dy="11">/ Screen list</tspan>
                                    </text>
                                    <circle cx="630" cy="100" r="32" fill="#E0E7FF" stroke="#6366F1" strokeWidth="2"/>
                                    <text x="630" y="92" textAnchor="middle" fontSize="20">&#128740;</text>
                                    <text x="630" y="142" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4338CA">
                                        <tspan x="630" dy="0">User Flow &amp;</tspan>
                                        <tspan x="630" dy="11">Screen Detail</tspan>
                                    </text>
                                    <circle cx="810" cy="100" r="32" fill="#FCE7F3" stroke="#EC4899" strokeWidth="2"/>
                                    <text x="810" y="92" textAnchor="middle" fontSize="20">&#128214;</text>
                                    <text x="810" y="142" textAnchor="middle" fontSize="9" fontWeight="700" fill="#9D174D">
                                        <tspan x="810" dy="0">Glossary</tspan>
                                        <tspan x="810" dy="11">&amp; Q&amp;A</tspan>
                                    </text>
                                    <rect x="43" y="28" width="94" height="36" rx="10" fill="#1D4ED8"/>
                                    <text x="90" y="50" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">GÓC NHÌN USER</text>
                                    <path d="M 90 64 L 90 68" stroke="#1D4ED8" strokeWidth="2"/>
                                </svg>

                                <div className="memory-grid">
                                    <article className="memory-card memory-card-1">
                                        <div className="memory-card-num">Bước 1</div>
                                        <div className="memory-card-icon">&#127919;</div>
                                        <div className="memory-card-title">Khái quát hệ thống</div>
                                        <p className="memory-card-hint">Mục đích · portal (Web/App/CMS) · tích hợp (nếu có)</p>
                                    </article>
                                    <article className="memory-card memory-card-2">
                                        <div className="memory-card-num">Bước 2</div>
                                        <div className="memory-card-icon">&#128101;</div>
                                        <div className="memory-card-title">Role</div>
                                        <p className="memory-card-hint">Ai dùng? Primary user(s) là ai?</p>
                                    </article>
                                    <article className="memory-card memory-card-3">
                                        <div className="memory-card-num">Bước 3</div>
                                        <div className="memory-card-icon">&#128203;</div>
                                        <div className="memory-card-title">Function list / Screen list</div>
                                        <p className="memory-card-hint">Theo từng Role — không trộn</p>
                                    </article>
                                    <article className="memory-card memory-card-4">
                                        <div className="memory-card-num">Bước 4</div>
                                        <div className="memory-card-icon">&#128740;</div>
                                        <div className="memory-card-title">User Flow &amp; Screen Detail</div>
                                        <p className="memory-card-hint">1 role ưu tiên · 1–2 flow · Screen Detail khi cần chi tiết</p>
                                    </article>
                                    <article className="memory-card memory-card-5">
                                        <div className="memory-card-num">Bước 5</div>
                                        <div className="memory-card-icon">&#128214;</div>
                                        <div className="memory-card-title">Glossary &amp; Q&amp;A</div>
                                        <p className="memory-card-hint">Thuật ngữ JP/VI · câu hỏi cần hỏi lại khách hàng / team</p>
                                    </article>
                                </div>

                                <div className="callout callout-green" style={{ marginTop: '16px' }}>
                                    <strong>Tip nhanh:</strong> Bạn chỉ cần nhớ 5 bước này và sử dụng file template Excel được cung cấp là đủ.
                                </div>
                            </div>
                        </div>

                        <div className="closing-actions" id="ket-bai-giang">
                            <button type="button" className="btn btn-quiz-open" id="btn-open-quiz">Kiểm tra kiến thức</button>
                            <a className="btn btn-primary" href="#cover">↑ Về đầu trang</a>
                        </div>
                    </div>
                </section>

                <div className="footer">
                    <p className="header-trainer">Quỳnh Nga BrSE Japan — Đồng Hành Cùng Bạn</p>
                    <p style={{ marginTop: '6px' }}>Training IT cho người mới · Thực tế · Dễ hiểu · Có chiều sâu</p>
                </div>
            </div>

            <div id="quiz-shell" className="quiz-shell" aria-hidden="true">
                <div className="quiz-shell-top">
                    <button type="button" className="btn btn-primary" id="btn-close-quiz-bar">← Quay lại bài giảng</button>
                    <span>20 câu — 10 cơ bản + 10 nâng cao</span>
                </div>
                <div className="quiz-shell-scroll">
                    <div id="quiz-inline">
                        <div className="header">
                            <div className="header-badge">Kiểm tra kiến thức</div>
                            <h1>Hiểu hệ thống từ góc nhìn User</h1>
                            <p className="header-sub">20 câu hỏi — 10 cơ bản + 10 nâng cao. Chọn đáp án rồi bấm “Kiểm tra” từng câu.</p>
                            <p className="header-trainer">Quỳnh Nga BrSE Japan — Đồng Hành Cùng Bạn</p>
                            <p className="header-meta">Tự chấm điểm · Có giải thích · Gắn với bài học LMS</p>
                        </div>

                        <div className="top-nav">
                            <a className="nav-link" id="back-to-lecture" href="#ket-bai-giang">← Quay lại bài giảng</a>
                            <span className="nav-note">Làm phần Cơ bản trước, sau đó làm phần Nâng cao.</span>
                        </div>

                        {/*===== PHẦN CƠ BẢN =====*/}
                        <div className="quiz-section" id="section-basic">
                            <div className="quiz-header">
                                <div className="quiz-icon basic">📘</div>
                                <div>
                                    <div className="quiz-title">Kiến thức cơ bản</div>
                                    <div className="quiz-subtitle">10 câu — nền tảng: mục đích, portal, role, function</div>
                                </div>
                            </div>
                            <span className="level-pill basic">Mức 1 · Cơ bản</span>

                            <div className="question-block" data-level="basic" id="q1">
                                <div className="question-num">Câu 1</div>
                                <div className="question-text">“Câu hỏi vàng” khi phân tích hệ thống từ góc User là gì?</div>
                                <ul className="options" data-correct="b">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Hệ thống viết bằng ngôn ngữ gì?</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> User vào đây để làm gì?</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Database có bao nhiêu bảng?</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Server đặt ở đâu?</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q1', 'basic')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q1"></div>
                            </div>

                            <div className="question-block" data-level="basic" id="q2">
                                <div className="question-num">Câu 2</div>
                                <div className="question-text">Portal trong hệ thống được hiểu là gì?</div>
                                <ul className="options" data-correct="a">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Cổng truy cập theo nhóm đối tượng (Admin portal, User
                                        portal…)
                                    </li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Tên miền website</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Ngôn ngữ lập trình backend</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Loại database</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q2', 'basic')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q2"></div>
                            </div>

                            <div className="question-block" data-level="basic" id="q3">
                                <div className="question-num">Câu 3</div>
                                <div className="question-text">Admin Portal thường được triển khai chủ yếu bằng hình thức nào?</div>
                                <ul className="options" data-correct="c">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Chỉ Mobile App</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Chỉ SMS</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Web (trình duyệt PC), có thể kèm CMS</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Email</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q3', 'basic')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q3"></div>
                            </div>

                            <div className="question-block" data-level="basic" id="q4">
                                <div className="question-num">Câu 4</div>
                                <div className="question-text">User Portal (ví dụ LMS) thường có những hình thức nào?</div>
                                <ul className="options" data-correct="b">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Chỉ CMS nội bộ</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Web và/hoặc Mobile App</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Chỉ API document</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Chỉ Desktop cài trên server</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q4', 'basic')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q4"></div>
                            </div>

                            <div className="question-block" data-level="basic" id="q5">
                                <div className="question-num">Câu 5</div>
                                <div className="question-text">Role trong hệ thống có nghĩa là gì?</div>
                                <ul className="options" data-correct="d">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Tên file source code</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Loại server</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Ngôn ngữ giao tiếp với khách hàng</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Vai trò người dùng — quyền và công việc tương ứng</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q5', 'basic')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q5"></div>
                            </div>

                            <div className="question-block" data-level="basic" id="q6">
                                <div className="question-num">Câu 6</div>
                                <div className="question-text">Function trong phân tích hệ thống là gì?</div>
                                <ul className="options" data-correct="a">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Một hành động user có thể thực hiện trên hệ thống</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Tên công ty phát triển phần mềm</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Phiên bản hệ điều hành</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Hợp đồng lao động</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q6', 'basic')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q6"></div>
                            </div>

                            <div className="question-block" data-level="basic" id="q7">
                                <div className="question-num">Câu 7</div>
                                <div className="question-text">Tích hợp Internal (nội bộ) nghĩa là gì?</div>
                                <ul className="options" data-correct="b">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Kết nối với Facebook, Google</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Kết nối hệ thống cùng tổ chức (VD: HRM nội bộ)</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Không kết nối hệ thống nào khác</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Chỉ dùng Excel offline</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q7', 'basic')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q7"></div>
                            </div>

                            <div className="question-block" data-level="basic" id="q8">
                                <div className="question-num">Câu 8</div>
                                <div className="question-text">Trong LMS, Primary user (người dùng chính) thường là ai?</div>
                                <ul className="options" data-correct="c">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Admin hệ thống</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Giáo viên</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Học viên</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Kế toán công ty</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q8', 'basic')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q8"></div>
                            </div>

                            <div className="question-block" data-level="basic" id="q9">
                                <div className="question-num">Câu 9</div>
                                <div className="question-text">CMS trong ngữ cảnh portal thường dùng để làm gì?</div>
                                <ul className="options" data-correct="a">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Soạn và đăng nội dung — thường trong Admin portal</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Học viên làm bài quiz</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Thanh toán học phí</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Gửi email marketing</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q9', 'basic')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q9"></div>
                            </div>

                            <div className="question-block" data-level="basic" id="q10">
                                <div className="question-num">Câu 10</div>
                                <div className="question-text">“Điểm cần xác nhận” nên dùng khi nào?</div>
                                <ul className="options" data-correct="d">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Sau khi deploy production 1 năm</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Khi viết code xong hết</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Chỉ khi nghỉ việc</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Khi trình bày lại hiểu biết với khách hàng / team</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q10', 'basic')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q10"></div>
                            </div>

                            <div className="quiz-result-box basic" id="quiz-result-basic">
                                <div className="result-score" id="result-score-basic">0/10</div>
                                <div className="result-label" id="result-label-basic">Kết quả phần Cơ bản</div>
                                <div className="result-comment" id="result-comment-basic"></div>
                                <button className="retake-btn" type="button" onClick={() => retakeSection('basic')}>Làm lại phần Cơ bản</button>
                            </div>
                        </div>

                        {/* ===== PHẦN NÂNG CAO ===== */}
                        <div className="quiz-section" id="section-advanced">
                            <div className="quiz-header">
                                <div className="quiz-icon advanced">🎯</div>
                                <div>
                                    <div className="quiz-title">Kiến thức nâng cao</div>
                                    <div className="quiz-subtitle">10 câu — phân biệt sâu, LMS, BrSE thực tế</div>
                                </div>
                            </div>
                            <span className="level-pill advanced">Mức 2 · Nâng cao</span>

                            <div className="question-block" data-level="advanced" id="q11">
                                <div className="question-num">Câu 11</div>
                                <div className="question-text">Portal và Web / Mobile App / CMS khác nhau thế nào?</div>
                                <ul className="options" data-correct="c">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Là một — chỉ khác tên gọi</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Portal thay thế hoàn toàn cho Function</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Portal = cổng theo đối tượng; Web/App/CMS = hình thức
                                        triển khai
                                    </li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> CMS luôn là portal riêng cho học viên</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q11', 'advanced')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q11"></div>
                            </div>

                            <div className="question-block" data-level="advanced" id="q12">
                                <div className="question-num">Câu 12</div>
                                <div className="question-text">Khi lập Function list, quy tắc vàng là gì?</div>
                                <ul className="options" data-correct="b">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Gộp tất cả role vào một bảng chung</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Viết riêng theo từng Role — không trộn Admin với Học
                                        viên
                                    </li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Chỉ liệt kê tên màn hình, không cần hành động</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Copy từ tài liệu đối thủ, không cần xác nhận</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q12', 'advanced')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q12"></div>
                            </div>

                            <div className="question-block" data-level="advanced" id="q13">
                                <div className="question-num">Câu 13</div>
                                <div className="question-text">Udemy / Coursera tích hợp với LMS thường được phân loại là gì?</div>
                                <ul className="options" data-correct="a">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> External — hệ thống bên thứ ba</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Internal — cùng công ty</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Không phải tích hợp</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Primary user</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q13', 'advanced')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q13"></div>
                            </div>

                            <div className="question-block" data-level="advanced" id="q14">
                                <div className="question-num">Câu 14</div>
                                <div className="question-text">Một dòng trong Function list nên mô tả tối thiểu điều gì để team/khách hàng không hiểu nhầm?</div>
                                <ul className="options" data-correct="b">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Chỉ tên màn hình UI (label nút, tên tab…)</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Hành động user làm được (vd: Học viên — đăng ký khóa,
                                        xem bài giảng, làm bài tập)
                                    </li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Chỉ URL endpoint API backend</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Chỉ tên bảng và cột trong database</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q14', 'advanced')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q14"></div>
                            </div>

                            <div className="question-block" data-level="advanced" id="q15">
                                <div className="question-num">Câu 15</div>
                                <div className="question-text">User Flow khác Function list ở điểm chính nào sau đây?</div>
                                <ul className="options" data-correct="b">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> User Flow chỉ dành cho developer; Function list dành
                                        cho tester
                                    </li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> User Flow thể hiện thứ tự bước và nhánh (happy path /
                                        ngoại lệ) giữa các function/màn hình; Function list là danh mục từng hành động
                                    </li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Hai loại tài liệu giống nhau, chỉ khác tên gọi</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Function list phải vẽ sơ đồ; User Flow chỉ cần bảng
                                        Excel
                                    </li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q15', 'advanced')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q15"></div>
                            </div>

                            <div className="question-block" data-level="advanced" id="q16">
                                <div className="question-num">Câu 16</div>
                                <div className="question-text">Glossary nên được lập như thế nào khi làm dự án Nhật?</div>
                                <ul className="options" data-correct="d">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Chỉ dịch Google một lần, không cần cập nhật</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Chỉ ghi tiếng Việt, bỏ qua thuật ngữ gốc</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Không cần vì đã biết tiếng Nhật</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Từ tài liệu/màn hình/họp; có thể dùng AI nhưng phải
                                        đối chiếu
                                    </li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q16', 'advanced')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q16"></div>
                            </div>

                            <div className="question-block" data-level="advanced" id="q17">
                                <div className="question-num">Câu 17</div>
                                <div className="question-text">Quan hệ Function và Screen thường là gì?</div>
                                <ul className="options" data-correct="a">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Thường 1 Function chính → 1 Screen chính</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Screen không liên quan Function</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Một Screen luôn có 10 Function</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Function chỉ dành cho dev, không cho BrSE</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q17', 'advanced')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q17"></div>
                            </div>

                            <div className="question-block" data-level="advanced" id="q18">
                                <div className="question-num">Câu 18</div>
                                <div className="question-text">Thứ tự phân tích hệ thống đúng theo bài học là gì?</div>
                                <ul className="options" data-correct="c">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Function → Role → Portal → Mục đích</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Tích hợp → Glossary → Function</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Khái quát → Role → Function/Screen → User
                                        Flow &amp; Detail → Glossary
                                    </li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Chỉ cần Glossary là đủ onboard</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q18', 'advanced')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q18"></div>
                            </div>

                            <div className="question-block" data-level="advanced" id="q19">
                                <div className="question-num">Câu 19</div>
                                <div className="question-text">Teacher Leader trong LMS khác Teacher thường ở điểm nào?</div>
                                <ul className="options" data-correct="b">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Chỉ học viên mới có Leader</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Thêm quyền duyệt bài / giám sát nhóm giáo viên</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Không đăng nhập được</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Chỉ dùng Mobile App</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q19', 'advanced')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q19"></div>
                            </div>

                            <div className="question-block" data-level="advanced" id="q20">
                                <div className="question-num">Câu 20</div>
                                <div className="question-text">VNPay tích hợp LMS để làm gì? Mục đích tích hợp là gì?</div>
                                <ul className="options" data-correct="a">
                                    <li className="option" data-val="a" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">A</span> Thu học phí / thanh toán trực tuyến — External</li>
                                    <li className="option" data-val="b" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">B</span> Đồng bộ danh sách nhân sự nội bộ</li>
                                    <li className="option" data-val="c" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">C</span> Soạn bài giảng bằng video</li>
                                    <li className="option" data-val="d" onClick={(e) => selectOption(e.currentTarget as HTMLElement)}><span className="option-letter">D</span> Dịch tài liệu sang tiếng Nhật</li>
                                </ul>
                                <button className="check-btn" onClick={(e) => checkAnswer(e.currentTarget as HTMLElement, 'q20', 'advanced')}>Kiểm tra</button>
                                <div className="answer-feedback" id="fb-q20"></div>
                            </div>

                            <div className="quiz-result-box advanced" id="quiz-result-advanced">
                                <div className="result-score" id="result-score-advanced">0/10</div>
                                <div className="result-label" id="result-label-advanced">Kết quả phần Nâng cao</div>
                                <div className="result-comment" id="result-comment-advanced"></div>
                                <button className="retake-btn" type="button" onClick={() => retakeSection('advanced')}>
                                    Làm lại phần Nâng cao
                                </button>
                            </div>
                        </div>

                        <div className="quiz-final-grade" id="quiz-final-grade">
                            <div className="quiz-final-actions">
                                <button type="button" className="check-btn" id="btn-grade-entire-quiz" onClick={() => gradeEntireQuiz()}>
                                    Chấm điểm
                                </button>
                                <button type="button" className="btn-view-answers" id="btn-toggle-answers" onClick={() => toggleShowAnswers()}>
                                    Xem đáp án
                                </button>
                            </div>
                            <div className="quiz-total-score is-empty" id="quiz-total-score" aria-live="polite">Bấm “Chấm điểm” để xem tổng kết toàn bài.</div>
                        </div>

                        <div className="footer">
                            <p className="header-trainer">Quỳnh Nga BrSE Japan — Đồng Hành Cùng Bạn</p>
                            <p style={{ marginTop: '6px' }}>Training IT cho người mới · Hiểu hệ thống từ góc nhìn User</p>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default TheSystemFromUserVision

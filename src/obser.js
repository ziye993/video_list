export default function Obser() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 根据 entry.target 执行不同操作
            }
        });
    });

    // 多个元素共用一个观察者
    elements.forEach(el => observer.observe(el));
}
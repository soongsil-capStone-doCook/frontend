// 공통 Layout 컴포넌트
const Layout = ({ children, header, footer }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {header && <header>{header}</header>}
      <main className="flex-1">{children}</main>
      {footer && <footer>{footer}</footer>}
    </div>
  );
};

export default Layout;


export const MenuButton: React.FC<MenuButtonProps> = ({
  label,
  view,
  setCurrentView,
  className,
}) => (
  <button className={`${className}`} onClick={() => setCurrentView(view)}>
    {label}
  </button>
);

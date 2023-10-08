export const MenuButton: React.FC<MenuButtonProps> = ({
  label,
  view,
  setCurrentView,
}) => <button onClick={() => setCurrentView(view)}>{label}</button>;

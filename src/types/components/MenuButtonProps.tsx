interface MenuButtonProps {
  label: string;
  view: ViewType;
  setCurrentView: React.Dispatch<React.SetStateAction<ViewType>>;
  className?: string; // The '?' indicates that this prop is optional.
}

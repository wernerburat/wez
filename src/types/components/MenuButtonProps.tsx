interface MenuButtonProps {
  label: string;
  view: ViewType;
  setCurrentView: React.Dispatch<React.SetStateAction<ViewType>>;
}

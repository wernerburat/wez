interface Props {
  children: React.ReactNode;
}

const Overlay = ({ children }: Props): React.ReactNode => {
  return (
    <div className="overlay fixed left-0 top-0 flex h-full w-full">
      {children}
    </div>
  );
};

export default Overlay;

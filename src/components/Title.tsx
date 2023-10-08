export const Title: React.FC<TitleProps> = ({ children, className }) => {
  return (
    <div className={`title ${className}`}>
      <h1 className="text-4xl">{children}</h1>
    </div>
  );
};

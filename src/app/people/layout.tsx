const PeopleLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-semibold">People</h1>
      {children}
    </div>
  );
};

export default PeopleLayout;

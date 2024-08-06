const PeopleLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="px-10 py-5">
      <h1 className="text-2xl font-semibold">People</h1>
      {children}
    </div>
  );
};

export default PeopleLayout;

const Header = () => {
  const user = {
    name: "Om Packer and Movers",
  };
  return (
    <header className="flex bg-blue-950 text-white justify-between px-10 py-5">
      <div>
        <p>1st Om Packers And Mover</p>
      </div>

      <div>
        <input
          className="bg-gray-200 rounded text-blue-95 px-5 py-2 placeholder:text-blue-950"
          type="search"
          placeholder="Search ..."
        />
      </div>

      <div className="flex justify-center items-center rounded-full h-10 w-10 bg-yellow-600">
        <p className="flex justify-center items-center text-white text-xl font-semibold">
          {user?.name[0]}
        </p>
      </div>
    </header>
  );
};

export default Header;

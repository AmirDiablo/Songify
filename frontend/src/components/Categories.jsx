const Categories = () => {
    return (
        <div className="px-10 backdrop-blur-xs -mt-10 overflow-x-auto *:text-center *:p-3 *:bg-[#22222c] *:text-white/50 flex gap-2 *:h-max *:flex-none  *:rounded-full hidenScroll">
            <div className="active">All</div>
            <div>New Release</div>
            <div>Trending</div>
            <div>Top</div>
            <div>Summer</div>
            <div>Hits</div>
        </div>
     );
}
 
export default Categories;
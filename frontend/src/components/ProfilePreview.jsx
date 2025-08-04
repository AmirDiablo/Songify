const ProfilePreview = ({artist}) => {
    return ( 
        <div className="flex items-center gap-2 px-5 py-5">
            <img src={"/profiles/"+artist.profile} className="rounded-full aspect-square w-15" />
            <div>
                <p className="text-[17px] font-[600]">{artist.username}</p >
                <p className="text-white/50">{artist.isArtist == false ? "profile" : "Artist"}</p>
            </div>
        </div>
     );
}
 
export default ProfilePreview;
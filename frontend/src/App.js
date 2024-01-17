import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/1_home/Home";
import MyPage from "./pages/3_mypage/MyPage";
import UserProfile from "./pages/4_userprofile/UserProfile";
import Board from "./pages/5_board/Board";
import Nav from "./pages/Nav/Nav";

import SignUp from "./pages/6_signup/SignUp";
import SignIn from "./pages/7_signin/SignIn";
import Write from "./pages/8_write/Write";
import Post from "./pages/9_Post/Post";
import EditPost from "./pages/9_Post/EditPost";
import DmPage from "./pages/10_dmpage/DmPage";
import Dm from "./pages/11_dm/dm";

import ShelterBoard from "./pages/12_shelterboard/ShelterBoard";
import CommunityBoard from "./pages/14_communityboard/CommunityBoard";
import MakeCommunity from "./pages/15_makecommunity/MakeCommunity";
import Community from "./pages/16_community/Community";
import CommunityInnerBoard from "./pages/17_communityinnerboard/CommunityInnerBoard";
import CommunityWrite from "./pages/18_communitywrite/CommunityWrite";
import CommunityPage from "./pages/17.1_communitypage/CommunityPage";
import CommunityTalk from "./pages/19_communitytalk/CommunityTalk";
import NotFound from "./pages/20_notfound/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", maxHeight: "100vh" }}>
        <Nav />
        <main style={{ flexGrow: 1, overflowY: "auto" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/userprofile/:username" element={<UserProfile />} />
            <Route path="/board" element={<Board />} />
            <Route path="/user/signup" element={<SignUp />} />
            <Route path="/user/signin" element={<SignIn />} />
            <Route path="/board/write" element={<Write />} />
            <Route path="/board/:board_id" element={<Post />} />
            <Route path="/board/edit/:board_id" element={<EditPost />} />
            <Route path="/dmpage" element={<DmPage />} />
            <Route path="/dm/:chat_name" element={<Dm />} />
            <Route path="/shelterboard" element={<ShelterBoard />} />
            <Route path="/communityboard" element={<CommunityBoard />} />
            <Route
              path="/communityboard/makecommunity"
              element={<MakeCommunity />}
            />
            <Route
              path="communityboard/makecommunity/:community_id/update"
              element={<MakeCommunity />}
            />
            <Route
              path="/communityboard/community/:community_id"
              element={<Community />}
            />
            <Route
              path="/communityboard/community/:community_id/communityinnerboard"
              element={<CommunityInnerBoard />}
            />
            <Route
              path="/communityboard/community/:community_id/communityinnerboard/CommunityWrite"
              element={<CommunityWrite />}
            />

            <Route
              path="/communityboard/community/:community_id/communityinnerboard/communitypage/:pageNum"
              element={<CommunityPage />}
            />
            <Route
              path="/communityboard/community/:community_id/communityinnerboard/CommunityWrite/:pageNum/update"
              element={<CommunityWrite />}
            />
            <Route
              path="/communityboard/community/:community_id/CommunityTalk"
              element={<CommunityTalk />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

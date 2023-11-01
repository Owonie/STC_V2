import { useRecoilState } from 'recoil';
import { userState } from '../../states/accountState';

const ProfileBar = () => {
  const [user] = useRecoilState(userState);

  return (
    <div>
      {user.displayName}
      <img src={user.photoURL} alt='' />
      <div>온라인</div>
      <button>profile</button>
    </div>
  );
};

export default ProfileBar;

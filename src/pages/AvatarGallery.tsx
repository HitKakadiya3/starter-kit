// Purple background avatars (home versions)
import intjImg from '@/assets/personalities-home/intj-strategist.png';
import intpImg from '@/assets/personalities-home/intp-thinker.png';
import entjImg from '@/assets/personalities-home/entj-leader.png';
import entpImg from '@/assets/personalities-home/entp-innovator.png';
import infjImg from '@/assets/personalities-home/infj-visionary.png';
import infpImg from '@/assets/personalities-home/infp-idealist.png';
import enfjImg from '@/assets/personalities-home/enfj-guide.png';
import enfpImg from '@/assets/personalities-home/enfp-dreamer.png';
import istjImg from '@/assets/personalities-home/istj-inspector.png';
import isfjImg from '@/assets/personalities-home/isfj-protector.png';
import estjImg from '@/assets/personalities-home/estj-director.png';
import esfjImg from '@/assets/personalities-home/esfj-caretaker.png';
import istpImg from '@/assets/personalities-home/istp-craftsman.png';
import isfpImg from '@/assets/personalities-home/isfp-artist.png';
import estpImg from '@/assets/personalities-home/estp-daredevil.png';
import esfpImg from '@/assets/personalities-home/esfp-performer.png';

import intjFImg from '@/assets/personalities-female-home/intj-strategist.png';
import intpFImg from '@/assets/personalities-female-home/intp-thinker.png';
import entjFImg from '@/assets/personalities-female-home/entj-leader.png';
import entpFImg from '@/assets/personalities-female-home/entp-innovator.png';
import infjFImg from '@/assets/personalities-female-home/infj-visionary.png';
import infpFImg from '@/assets/personalities-female-home/infp-idealist.png';
import enfjFImg from '@/assets/personalities-female-home/enfj-guide.png';
import enfpFImg from '@/assets/personalities-female-home/enfp-dreamer.png';
import istjFImg from '@/assets/personalities-female-home/istj-inspector.png';
import isfjFImg from '@/assets/personalities-female-home/isfj-protector.png';
import estjFImg from '@/assets/personalities-female-home/estj-director.png';
import esfjFImg from '@/assets/personalities-female-home/esfj-caretaker.png';
import istpFImg from '@/assets/personalities-female-home/istp-craftsman.png';
import isfpFImg from '@/assets/personalities-female-home/isfp-artist.png';
import estpFImg from '@/assets/personalities-female-home/estp-daredevil.png';
import esfpFImg from '@/assets/personalities-female-home/esfp-performer.png';

// White background avatars (regular versions)
import intjWImg from '@/assets/personalities/intj-strategist.png';
import intpWImg from '@/assets/personalities/intp-thinker.png';
import entjWImg from '@/assets/personalities/entj-leader.png';
import entpWImg from '@/assets/personalities/entp-innovator.png';
import infjWImg from '@/assets/personalities/infj-visionary.png';
import infpWImg from '@/assets/personalities/infp-idealist.png';
import enfjWImg from '@/assets/personalities/enfj-guide.png';
import enfpWImg from '@/assets/personalities/enfp-dreamer.png';
import istjWImg from '@/assets/personalities/istj-inspector.png';
import isfjWImg from '@/assets/personalities/isfj-protector.png';
import estjWImg from '@/assets/personalities/estj-director.png';
import esfjWImg from '@/assets/personalities/esfj-caretaker.png';
import istpWImg from '@/assets/personalities/istp-craftsman.png';
import isfpWImg from '@/assets/personalities/isfp-artist.png';
import estpWImg from '@/assets/personalities/estp-daredevil.png';
import esfpWImg from '@/assets/personalities/esfp-performer.png';

import intjWFImg from '@/assets/personalities-female/intj-strategist.png';
import intpWFImg from '@/assets/personalities-female/intp-thinker.png';
import entjWFImg from '@/assets/personalities-female/entj-leader.png';
import entpWFImg from '@/assets/personalities-female/entp-innovator.png';
import infjWFImg from '@/assets/personalities-female/infj-visionary.png';
import infpWFImg from '@/assets/personalities-female/infp-idealist.png';
import enfjWFImg from '@/assets/personalities-female/enfj-guide.png';
import enfpWFImg from '@/assets/personalities-female/enfp-dreamer.png';
import istjWFImg from '@/assets/personalities-female/istj-inspector.png';
import isfjWFImg from '@/assets/personalities-female/isfj-protector.png';
import estjWFImg from '@/assets/personalities-female/estj-director.png';
import esfjWFImg from '@/assets/personalities-female/esfj-caretaker.png';
import istpWFImg from '@/assets/personalities-female/istp-craftsman.png';
import isfpWFImg from '@/assets/personalities-female/isfp-artist.png';
import estpWFImg from '@/assets/personalities-female/estp-daredevil.png';
import esfpWFImg from '@/assets/personalities-female/esfp-performer.png';

const types = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];
const names = ['Strategist','Thinker','Leader','Innovator','Visionary','Idealist','Guide','Dreamer','Inspector','Protector','Director','Caretaker','Craftsman','Artist','Daredevil','Performer'];

const purpleMale = [intjImg,intpImg,entjImg,entpImg,infjImg,infpImg,enfjImg,enfpImg,istjImg,isfjImg,estjImg,esfjImg,istpImg,isfpImg,estpImg,esfpImg];
const purpleFemale = [intjFImg,intpFImg,entjFImg,entpFImg,infjFImg,infpFImg,enfjFImg,enfpFImg,istjFImg,isfjFImg,estjFImg,esfjFImg,istpFImg,isfpFImg,estpFImg,esfpFImg];
const whiteMale = [intjWImg,intpWImg,entjWImg,entpWImg,infjWImg,infpWImg,enfjWImg,enfpWImg,istjWImg,isfjWImg,estjWImg,esfjWImg,istpWImg,isfpWImg,estpWImg,esfpWImg];
const whiteFemale = [intjWFImg,intpWFImg,entjWFImg,entpWFImg,infjWFImg,infpWFImg,enfjWFImg,enfpWFImg,istjWFImg,isfjWFImg,estjWFImg,esfjWFImg,istpWFImg,isfpWFImg,estpWFImg,esfpWFImg];

const AvatarGrid = ({ title, maleImgs, femaleImgs }: { title: string; maleImgs: string[]; femaleImgs: string[] }) => (
  <div className="mb-16">
    <h2 className="text-2xl font-bold text-primary mb-6">{title}</h2>
    <h3 className="text-lg font-semibold text-foreground mb-3">Male</h3>
    <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-8">
      {types.map((t, i) => (
        <div key={`m-${t}`} className="flex flex-col items-center gap-1">
          <img src={maleImgs[i]} alt={t} className="w-24 h-24 rounded-full object-cover border-2 border-border" />
          <span className="text-xs font-bold">{t}</span>
          <span className="text-[10px] text-muted-foreground">{names[i]}</span>
        </div>
      ))}
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-3">Female</h3>
    <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
      {types.map((t, i) => (
        <div key={`f-${t}`} className="flex flex-col items-center gap-1">
          <img src={femaleImgs[i]} alt={t} className="w-24 h-24 rounded-full object-cover border-2 border-border" />
          <span className="text-xs font-bold">{t}</span>
          <span className="text-[10px] text-muted-foreground">{names[i]}</span>
        </div>
      ))}
    </div>
  </div>
);

const AvatarGallery = () => (
  <div className="min-h-screen bg-background p-6">
    <h1 className="text-3xl font-bold text-foreground mb-10">Avatar Gallery</h1>
    <AvatarGrid title="Purple Background" maleImgs={purpleMale} femaleImgs={purpleFemale} />
    <AvatarGrid title="White Background" maleImgs={whiteMale} femaleImgs={whiteFemale} />
  </div>
);

export default AvatarGallery;

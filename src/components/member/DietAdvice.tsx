import React, { useState } from 'react';
import { ChevronDown, BookOpen, Clock, Flame, UtensilsCrossed, Settings, Info } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

export default function DietAdvice() {
  const [openSection, setOpenSection] = useState<number | null>(0); // 最初のセクションをデフォルトで開く

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  const adviceSections = [
    {
      title: '減量の基本：カロリーと代謝',
      icon: <Flame className="w-4 h-4 text-rose-500" />,
      content: (
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            減量の基本は「消費カロリー ＞ 摂取カロリー」ですが、最新の代謝学では「何を、いつ、どう食べるか」が代謝へのスイッチとして働くと考えられています。
          </p>
          <ul className="list-disc pl-4 space-y-1 text-gray-700 font-medium">
            <li>基本の大目標：1日 25kcal × 目標体重</li>
            <li>3〜6ヶ月で現体重の3%減を目指すと、見た目と数値（血圧など）に変化が現れます。</li>
          </ul>
        </div>
      )
    },
    {
      title: '性別の違いとホルモンサイクル',
      icon: <Info className="w-4 h-4 text-blue-500" />,
      content: (
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            男性は内臓脂肪がつきやすく燃えやすい特徴がありますが、女性はホルモン周期によりダイエットの適したタイミングが変わります。
          </p>
          <ul className="space-y-2">
            <li className="bg-gray-50 p-2 rounded border border-gray-100">
              <span className="font-bold text-gray-900 block mb-1">卵胞期（生理後）</span>
              インスリンの効き込みが良く、糖質をエネルギーに変えやすい代謝ボーナス期。しっかり運動しましょう。
            </li>
            <li className="bg-gray-50 p-2 rounded border border-gray-100">
              <span className="font-bold text-gray-900 block mb-1">黄体期（生理前）</span>
              基礎代謝が少し上がりますが、食欲も増えます。無理な制限をせず、糖質と脂質の組み合わせを避けるよう工夫しましょう。
            </li>
          </ul>
        </div>
      )
    },
    {
      title: '時間栄養学：食べる時間帯',
      icon: <Clock className="w-4 h-4 text-amber-500" />,
      content: (
        <div className="space-y-3 text-sm text-gray-600">
          <p>食事のタイミング（いつ食べるか）も極めて重要です。</p>
          <ul className="list-disc pl-4 space-y-1">
            <li><span className="font-bold text-gray-900">時間制限摂食：</span>1日の食事を8〜10時間以内に収める（例：朝8時〜夕方18時）と、脂肪燃焼が促進されます。</li>
            <li><span className="font-bold text-gray-900">夜間の食事NG：</span>寝る前3時間以内の食事は脂肪蓄積を促します。なるべく控えましょう。</li>
          </ul>
        </div>
      )
    },
    {
      title: '最新のタンパク質・食べる順番',
      icon: <UtensilsCrossed className="w-4 h-4 text-emerald-500" />,
      content: (
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            タンパク質は減量中の筋肉減少を防ぎます。1日を通じてこまめに（3〜5時間おき）摂取することが効果的です。
          </p>
          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 mt-2">
            <p className="font-bold text-emerald-900 mb-1 flex items-center"><BookOpen className="w-3 h-3 mr-1" /> 食べる順番（ベジタブル・プロテイン・ファースト）</p>
            <ol className="list-decimal pl-4 space-y-1 text-emerald-800 text-xs">
              <li>食物繊維（野菜・海藻）を食べる（糖の吸収を阻害）</li>
              <li>タンパク質・脂質（肉・魚・卵）を食べる（満腹ホルモン分泌）</li>
              <li>最後に炭水化物を食べる（血糖値の急上昇を防ぐ）</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      title: '停滞期の打破とサプリメント',
      icon: <Settings className="w-4 h-4 text-indigo-500" />,
      content: (
        <div className="space-y-3 text-sm text-gray-600">
          <p>長くカロリーを制限し続けると、身体が省エネモード（代謝適応）になり痩せにくくなります。</p>
          <ul className="list-disc pl-4 space-y-1">
            <li><span className="font-bold text-gray-900">ダイエットブレイク：</span>2週間制限したら、次の2週間は維持カロリーに戻すなど、休息を入れるとリバウンドを防げます。</li>
            <li><span className="font-bold text-gray-900">微量栄養素：</span>ビタミンB群やマグネシウム・鉄分が不足すると脂肪が燃えません。マルチビタミンなどの補給も効果的です。</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="mt-8 space-y-3">
      <div className="flex items-center space-x-2 px-1 mb-2">
        <BookOpen className="w-5 h-5 text-gray-900" />
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">栄養＆ダイエットガイド</h2>
      </div>
      
      <div className="space-y-2">
        {adviceSections.map((section, index) => {
          const isOpen = openSection === index;
          return (
            <Card key={index} className="overflow-hidden border-gray-200 shadow-sm transition-all duration-200">
              <button 
                onClick={() => toggleSection(index)}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-gray-50 rounded-md border border-gray-100">
                    {section.icon}
                  </div>
                  <span className="font-medium text-gray-900 text-sm tracking-wide">{section.title}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isOpen && (
                <div className="p-4 pt-0 bg-white border-t border-gray-50">
                  <div className="pt-3">
                    {section.content}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      
      <div className="text-center mt-6 text-xs text-gray-400 leading-relaxed px-4 pb-24">
        最新の代謝研究に基づく栄養ガイドです。個々の体質やライフスタイルに合わせて無理なく取り入れてください。
      </div>
    </div>
  );
}

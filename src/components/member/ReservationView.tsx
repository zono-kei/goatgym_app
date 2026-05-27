import React, { useState } from 'react';
import { useAppStore } from '../../store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Calendar as CalendarIcon, Clock, CheckCircle } from 'lucide-react';

export default function ReservationView() {
  const { currentUser, reservations, addReservation } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  const userReservations = reservations
    .filter(r => r.userId === currentUser?.id && r.status === 'upcoming')
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const handleReserve = () => {
    if (!selectedDate || !selectedTime) return;
    addReservation({
      id: `r_${Date.now()}`,
      userId: currentUser!.id,
      date: selectedDate,
      time: selectedTime,
      status: 'upcoming'
    });
    alert('予約が完了しました。');
    setSelectedTime('');
    setSelectedDate('');
  };

  const availableTimes = ['10:00', '11:00', '13:00', '14:00', '15:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold tracking-tight">次回のご予約</h1>
      
      {userReservations.length > 0 ? (
        <div className="space-y-4">
          {userReservations.map(res => (
            <Card key={res.id} className="border-gray-200">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">UPCOMING</p>
                  <p className="text-xl font-bold text-gray-900">{res.date.split('-').join('/')}</p>
                  <p className="text-lg text-gray-700">{res.time}〜</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-gray-900" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">現在、予約はありません。</p>
      )}

      <div className="pt-4 space-y-4">
        <h2 className="text-lg font-semibold">新規予約</h2>
        <Card>
          <CardContent className="p-5 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                日付を選択
              </label>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // today
                className="w-full bg-white border border-gray-200 rounded-md p-3 text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                時間を選択
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 rounded-md text-sm transition-colors border ${selectedTime === time ? 'bg-gray-900 text-white border-gray-900 font-bold shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              className="w-full h-12 text-base mt-4 font-bold bg-gray-900 text-white hover:bg-gray-800" 
              disabled={!selectedDate || !selectedTime}
              onClick={handleReserve}
            >
              この日時で予約する
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

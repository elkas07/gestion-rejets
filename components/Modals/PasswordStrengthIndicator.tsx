
import React from 'react';

interface Props {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<Props> = ({ password }) => {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const criteria = [
    { label: '8 caractères minimum', met: hasLength },
    { label: 'Une majuscule', met: hasUpper },
    { label: 'Une minuscule', met: hasLower },
    { label: 'Un chiffre', met: hasNumber },
  ];

  const metCount = criteria.filter(c => c.met).length;
  const strengthColor = metCount === 4 ? 'bg-green-500' : metCount >= 2 ? 'bg-yellow-500' : 'bg-red-500';
  const strengthText = metCount === 4 ? 'Fort' : metCount >= 2 ? 'Moyen' : 'Faible';

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${strengthColor}`} 
            style={{ width: `${(metCount / 4) * 100}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase">{strengthText}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {criteria.map((c, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <i className={`fas ${c.met ? 'fa-check-circle text-green-500' : 'fa-circle text-slate-300'} text-[10px]`} />
            <span className={`text-[11px] ${c.met ? 'text-green-700 font-medium' : 'text-slate-500'}`}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

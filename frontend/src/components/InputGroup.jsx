import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

const InputGroup = React.forwardRef(({ label, icon: Icon, error, ...props }, ref) => {
    return (
        <div className="mb-4">
            {label && <label className="block text-sm font-bold text-brand-dark mb-2">{label}</label>}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-brand-red/50" aria-hidden="true" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
                        input-glass
                        ${Icon ? 'pl-10' : ''}
                        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                    `}
                    {...props}
                />
                {error && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
        </div>
    );
});

export default InputGroup;

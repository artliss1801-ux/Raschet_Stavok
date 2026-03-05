'use client';

import * as React from 'react';
import { Check, MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CityResult {
  id: string;
  name: string;
  fullName: string;
  region: string;
  country: 'RU' | 'BY';
  type: string;
  lat: number | null;
  lon: number | null;
}

interface CitySelectProps {
  value: string;
  onChange: (value: string, cityData?: CityResult) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CitySelect({
  value,
  onChange,
  placeholder = 'Выберите населённый пункт',
  disabled = false,
}: CitySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [cities, setCities] = React.useState<CityResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedCity, setSelectedCity] = React.useState<CityResult | null>(null);
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  // Загрузка сохранённого города при инициализации
  React.useEffect(() => {
    if (value && !selectedCity) {
      // Пытаемся найти город в списке
      const savedCity = cities.find(c => c.id === value);
      if (savedCity) {
        setSelectedCity(savedCity);
      }
    }
  }, [value, cities, selectedCity]);

  // Дебаунс поиска
  React.useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.length < 2) {
      setCities([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchCities(searchQuery);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const searchCities = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/search-cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCities(data.cities);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (city: CityResult) => {
    setSelectedCity(city);
    onChange(city.id, city);
    setOpen(false);
    setSearchQuery('');
  };

  // Группировка по стране
  const groupedCities = React.useMemo(() => {
    const russia = cities.filter(c => c.country === 'RU');
    const belarus = cities.filter(c => c.country === 'BY');
    return { russia, belarus };
  }, [cities]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          {selectedCity ? (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{selectedCity.fullName}</span>
              <span className="text-slate-400 text-xs">({selectedCity.region})</span>
            </span>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Введите название населённого пункта..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[350px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                <span className="ml-2 text-sm text-slate-500">Поиск...</span>
              </div>
            ) : searchQuery.length < 2 ? (
              <div className="py-6 text-center text-sm text-slate-500">
                Введите минимум 2 символа для поиска
              </div>
            ) : cities.length === 0 ? (
              <CommandEmpty>Населённый пункт не найден</CommandEmpty>
            ) : (
              <>
                {groupedCities.russia.length > 0 && (
                  <CommandGroup heading="Россия">
                    {groupedCities.russia.map((city) => (
                      <CommandItem
                        key={city.id}
                        value={city.id}
                        onSelect={() => handleSelect(city)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === city.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex flex-col">
                          <span>
                            {city.type} {city.name}
                          </span>
                          <span className="text-xs text-slate-400">{city.region}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {groupedCities.belarus.length > 0 && (
                  <CommandGroup heading="Беларусь">
                    {groupedCities.belarus.map((city) => (
                      <CommandItem
                        key={city.id}
                        value={city.id}
                        onSelect={() => handleSelect(city)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            value === city.id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <div className="flex flex-col">
                          <span>
                            {city.type} {city.name}
                          </span>
                          <span className="text-xs text-slate-400">{city.region}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
        <div className="border-t px-3 py-2 text-xs text-slate-500">
          💡 Поиск работает по всем населённым пунктам России и Беларуси
        </div>
      </PopoverContent>
    </Popover>
  );
}

export type { CityResult };

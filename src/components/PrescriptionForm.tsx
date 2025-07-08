
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PrescriptionFormData {
  visionType: string;
  sph: string;
  cyl: string;
  axis: string;
  add: string;
  pd: string;
  lensType: string;
  rightEye: {
    sph: string;
    cyl: string;
    axis: string;
  };
  leftEye: {
    sph: string;
    cyl: string;
    axis: string;
  };
  rightEyeFar: {
    sph: string;
    cyl: string;
    axis: string;
    lensType: string;
    lensColor: string;
  };
  rightEyeNear: {
    sph: string;
    cyl: string;
    axis: string;
    lensType: string;
    lensColor: string;
  };
  leftEyeFar: {
    sph: string;
    cyl: string;
    axis: string;
    lensType: string;
    lensColor: string;
  };
  leftEyeNear: {
    sph: string;
    cyl: string;
    axis: string;
    lensType: string;
    lensColor: string;
  };
}

interface PrescriptionFormProps {
  formData: PrescriptionFormData;
  onChange: (field: string, value: string) => void;
  onEyeChange: (eye: 'rightEye' | 'leftEye', field: string, value: string) => void;
  onComplexEyeChange?: (eye: 'rightEyeFar' | 'rightEyeNear' | 'leftEyeFar' | 'leftEyeNear', field: string, value: string) => void;
}

export function PrescriptionForm({ formData, onChange, onEyeChange, onComplexEyeChange }: PrescriptionFormProps) {
  const lensTypeOptions = [
    { value: "monofokal", label: "Tek odaklı cam (monofokal)" },
    { value: "bifokal", label: "Bifokal cam" },
    { value: "progressif", label: "Progressif cam (çok odaklı / multifokal)" },
    { value: "ofis", label: "Ofis camı (iş camı / yakın-orta mesafe camı)" },
    { value: "fotokromik", label: "Fotokromik cam" },
    { value: "polarize", label: "Polarize cam" },
    { value: "gunes", label: "Güneş camı" },
    { value: "asferik", label: "Asferik cam" },
    { value: "organik", label: "Organik cam (plastik cam)" },
    { value: "mineral", label: "Mineral cam (cam cam)" },
  ];

  const lensColorOptions = [
    { value: "clear", label: "Şeffaf" },
    { value: "brown", label: "Kahverengi" },
    { value: "gray", label: "Gri" },
    { value: "green", label: "Yeşil" },
    { value: "blue", label: "Mavi" },
    { value: "yellow", label: "Sarı" },
    { value: "pink", label: "Pembe" },
    { value: "red", label: "Kırmızı" },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Reçete Bilgileri</h3>
      
      {/* Enhanced Prescription Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-left"></th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center" colSpan={3}>SAĞ</th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center" colSpan={3}>SOL</th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Cam Rengi</th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Cam Tipi</th>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-left"></th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Sferik</th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Silinderik</th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Aks</th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Sferik</th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Silinderik</th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Aks</th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center"></th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 dark:border-gray-600 p-2 font-medium">Uzak</td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.rightEyeFar?.sph || ''}
                  onChange={(e) => onComplexEyeChange?.('rightEyeFar', 'sph', e.target.value)}
                  className="h-8"
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.rightEyeFar?.cyl || ''}
                  onChange={(e) => onComplexEyeChange?.('rightEyeFar', 'cyl', e.target.value)}
                  className="h-8"
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.rightEyeFar?.axis || ''}
                  onChange={(e) => onComplexEyeChange?.('rightEyeFar', 'axis', e.target.value)}
                  className="h-8"
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.leftEyeFar?.sph || ''}
                  onChange={(e) => onComplexEyeChange?.('leftEyeFar', 'sph', e.target.value)}
                  className="h-8"
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.leftEyeFar?.cyl || ''}
                  onChange={(e) => onComplexEyeChange?.('leftEyeFar', 'cyl', e.target.value)}
                  className="h-8"
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.leftEyeFar?.axis || ''}
                  onChange={(e) => onComplexEyeChange?.('leftEyeFar', 'axis', e.target.value)}
                  className="h-8"
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1" rowSpan={2}>
                <Select 
                  value={formData.leftEyeFar?.lensColor || ''} 
                  onValueChange={(value) => onComplexEyeChange?.('leftEyeFar', 'lensColor', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Cam rengi" />
                  </SelectTrigger>
                  <SelectContent>
                    {lensColorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1" rowSpan={2}>
                <Select 
                  value={formData.leftEyeFar?.lensType || ''} 
                  onValueChange={(value) => onComplexEyeChange?.('leftEyeFar', 'lensType', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Cam tipi" />
                  </SelectTrigger>
                  <SelectContent>
                    {lensTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-600 p-2 font-medium">Yakın</td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.rightEyeNear?.sph || ''}
                  onChange={(e) => onComplexEyeChange?.('rightEyeNear', 'sph', e.target.value)}
                  className="h-8"
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.rightEyeNear?.cyl || ''}
                  onChange={(e) => onComplexEyeChange?.('rightEyeNear', 'cyl', e.target.value)}
                  className="h-8"
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.rightEyeNear?.axis || ''}
                  onChange={(e) => onComplexEyeChange?.('rightEyeNear', 'axis', e.target.value)}
                  className="h-8"
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.leftEyeNear?.sph || ''}
                  onChange={(e) => onComplexEyeChange?.('leftEyeNear', 'sph', e.target.value)}
                  className="h-8"
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.leftEyeNear?.cyl || ''}
                  onChange={(e) => onComplexEyeChange?.('leftEyeNear', 'cyl', e.target.value)}
                  className="h-8"
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.leftEyeNear?.axis || ''}
                  onChange={(e) => onComplexEyeChange?.('leftEyeNear', 'axis', e.target.value)}
                  className="h-8"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-600 p-2 font-medium">ADD</td>
              <td className="border border-gray-300 dark:border-gray-600 p-1" colSpan={3}>
                <Input
                  id="add"
                  value={formData.add}
                  onChange={(e) => onChange('add', e.target.value)}
                  className="h-8"
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-2 font-medium">PD</td>
              <td className="border border-gray-300 dark:border-gray-600 p-1" colSpan={2}>
                <Input
                  id="pd"
                  value={formData.pd}
                  onChange={(e) => onChange('pd', e.target.value)}
                  className="h-8"
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                {/* Empty cell to align with lens color */}
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                {/* Empty cell to align with lens type */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

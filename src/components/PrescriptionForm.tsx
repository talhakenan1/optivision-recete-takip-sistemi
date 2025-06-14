
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
    { value: "single-vision", label: "Tek Odak" },
    { value: "bifocal", label: "Bifokal" },
    { value: "progressive", label: "Progresif" },
    { value: "colormatic", label: "Colormatic" },
    { value: "sunglasses", label: "Sunglasses" },
    { value: "prescription-sunglasses", label: "Prescription Sunglasses" },
    { value: "tinted-lens", label: "Tinted Lens" },
    { value: "colored-lens", label: "Colored Lens" },
    { value: "prescription-lens", label: "Prescription Lens" },
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
      <h3 className="text-lg font-semibold">Prescription Details</h3>
      
      {/* New Enhanced Prescription Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-left"></th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center" colSpan={3}>SAĞ</th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center" colSpan={3}>SOL</th>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-left"></th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Uzak</th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Yakın</th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Cam Tipi</th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Uzak</th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Yakın</th>
              <th className="border border-gray-300 dark:border-gray-600 p-2 text-center">Cam Rengi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 dark:border-gray-600 p-2 font-medium">Sferik</td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.rightEyeFar?.sph || ''}
                  onChange={(e) => onComplexEyeChange?.('rightEyeFar', 'sph', e.target.value)}
                  className="h-8"
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.rightEyeNear?.sph || ''}
                  onChange={(e) => onComplexEyeChange?.('rightEyeNear', 'sph', e.target.value)}
                  className="h-8"
                />
              </td>
              <td className="border border-gray-300 dark:border-gray-600 p-1" rowSpan={3}>
                <Select 
                  value={formData.rightEyeFar?.lensType || ''} 
                  onValueChange={(value) => onComplexEyeChange?.('rightEyeFar', 'lensType', value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Lens tipi" />
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
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.leftEyeFar?.sph || ''}
                  onChange={(e) => onComplexEyeChange?.('leftEyeFar', 'sph', e.target.value)}
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
              <td className="border border-gray-300 dark:border-gray-600 p-1" rowSpan={3}>
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
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-600 p-2 font-medium">Silinderik</td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.rightEyeFar?.cyl || ''}
                  onChange={(e) => onComplexEyeChange?.('rightEyeFar', 'cyl', e.target.value)}
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
                  value={formData.leftEyeFar?.cyl || ''}
                  onChange={(e) => onComplexEyeChange?.('leftEyeFar', 'cyl', e.target.value)}
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
            </tr>
            <tr>
              <td className="border border-gray-300 dark:border-gray-600 p-2 font-medium">Aks</td>
              <td className="border border-gray-300 dark:border-gray-600 p-1">
                <Input
                  value={formData.rightEyeFar?.axis || ''}
                  onChange={(e) => onComplexEyeChange?.('rightEyeFar', 'axis', e.target.value)}
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
                  value={formData.leftEyeFar?.axis || ''}
                  onChange={(e) => onComplexEyeChange?.('leftEyeFar', 'axis', e.target.value)}
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
          </tbody>
        </table>
      </div>

      {/* ADD and PD fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="add" className="text-sm">ADD</Label>
          <Input
            id="add"
            value={formData.add}
            onChange={(e) => onChange('add', e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="pd" className="text-sm">PD</Label>
          <Input
            id="pd"
            value={formData.pd}
            onChange={(e) => onChange('pd', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}

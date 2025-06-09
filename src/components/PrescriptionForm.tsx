
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
}

interface PrescriptionFormProps {
  formData: PrescriptionFormData;
  onChange: (field: string, value: string) => void;
  onEyeChange: (eye: 'rightEye' | 'leftEye', field: string, value: string) => void;
}

export function PrescriptionForm({ formData, onChange, onEyeChange }: PrescriptionFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Prescription Details</h3>
      
      {/* Right Eye (OD) and Left Eye (OS) Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Right Eye (OD) */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Sağ Göz (OD)</h4>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="right-sph" className="text-sm">SPH</Label>
              <Input
                id="right-sph"
                value={formData.rightEye.sph}
                onChange={(e) => onEyeChange('rightEye', 'sph', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="right-cyl" className="text-sm">CYL</Label>
              <Input
                id="right-cyl"
                value={formData.rightEye.cyl}
                onChange={(e) => onEyeChange('rightEye', 'cyl', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="right-axis" className="text-sm">AXIS</Label>
              <Input
                id="right-axis"
                value={formData.rightEye.axis}
                onChange={(e) => onEyeChange('rightEye', 'axis', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="add" className="text-sm">ADD</Label>
            <Input
              id="add"
              value={formData.add}
              onChange={(e) => onChange('add', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Left Eye (OS) */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Sol Göz (OS)</h4>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="left-sph" className="text-sm">SPH</Label>
              <Input
                id="left-sph"
                value={formData.leftEye.sph}
                onChange={(e) => onEyeChange('leftEye', 'sph', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="left-cyl" className="text-sm">CYL</Label>
              <Input
                id="left-cyl"
                value={formData.leftEye.cyl}
                onChange={(e) => onEyeChange('leftEye', 'cyl', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="left-axis" className="text-sm">AXIS</Label>
              <Input
                id="left-axis"
                value={formData.leftEye.axis}
                onChange={(e) => onEyeChange('leftEye', 'axis', e.target.value)}
                className="mt-1"
              />
            </div>
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

      {/* Lens Type */}
      <div>
        <Label htmlFor="lensType" className="text-sm">Lens Tipi</Label>
        <Select value={formData.lensType} onValueChange={(value) => onChange('lensType', value)}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Lens tipini seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single-vision">Tek Odak</SelectItem>
            <SelectItem value="bifocal">Bifokal</SelectItem>
            <SelectItem value="progressive">Progresif</SelectItem>
            <SelectItem value="reading">Okuma</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

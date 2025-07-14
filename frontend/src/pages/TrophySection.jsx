import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Trash2, Plus } from "lucide-react";

export default function SkillsSection({ profile, updateField }) {
  const [skills, setSkills] = useState(profile.skills || [""]);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSkillChange = (index, value) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
    setHasChanges(true);
  };

  const addSkill = () => {
    setSkills([...skills, ""]);
    setHasChanges(true);
  };

  const removeSkill = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
    setHasChanges(true);
  };

  const handleSave = () => {
    updateField("skills", skills.filter(skill => skill.trim() !== ""));
    setHasChanges(false);
    alert("Skills updated!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Skills
          <Button size="sm" onClick={addSkill}>
            <Plus className="w-4 h-4 mr-1" /> Add Skill
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder={`Skill #${index + 1}`}
              value={skill}
              onChange={(e) => handleSkillChange(index, e.target.value)}
            />
            <Button type="button" size="icon" variant="destructive" onClick={() => removeSkill(index)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {hasChanges && (
          <div className="pt-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSave}
              disabled={skills.every(s => s.trim() === "")}
            >
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

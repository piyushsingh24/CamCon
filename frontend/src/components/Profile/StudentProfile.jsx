import { useReducer, useState } from 'react';
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea.jsx";
import { Pencil } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext.jsx";




export default function StudentProfilePage() {

  const { user } = useAuth();
  
  const [profile, setProfile] = useState({
    name: user.name,
    email: user?.email || "xyz.@gmail.com",
    phone: "NA",
    college: 'ABC University',
    course: 'BCA',
    year: '2nd Year',
    about:  user?.bio ||'Passionate student exploring full-stack development.',
    cgpa: '8.5',
    achievements: 'Won Hackathon 2024, Open Source Contributor',
    emailVerified: false,
    password: '********',
    privacy: {
      email: true,
      phone: false,
      payment: false,
    },
    lastLogin: '2025-07-09 20:11',
  });

  const [editField, setEditField] = useState(null);
  const [accounts, setAccounts] = useState([
    { bank: 'HDFC', upi: 'john@upi', default: true },
    { bank: 'SBI', upi: 'john.sbi@upi', default: false },
  ]);
  const [bankInputMode, setBankInputMode] = useState('');

  const [showPasswordVerify, setShowPasswordVerify] = useState(false);
  const [enteredCurrentPassword, setEnteredCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [academicHistory, setAcademicHistory] = useState([
    { institute: 'XYZ High School', year: '2018', subject: 'Science', percentage: '85%' },
    { institute: 'ABC University', year: '2024', subject: 'Computer Science', percentage: '88%' },
  ]);

  const [verifyEmail, setVerifyEmail] = useState(false);
  const [verifyPhone, setVerifyPhone] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpPhone, setOtpPhone] = useState('');
  const [hasChanges, setHasChanges] = useState(false);


  // Email verification steps
  const [emailStep, setEmailStep] = useState("idle");
  const [otpEmailCurrent, setOtpEmailCurrent] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [otpEmailNew, setOtpEmailNew] = useState("");

  // Phone verification steps
  const [phoneStep, setPhoneStep] = useState("idle");
  const [otpPhoneCurrent, setOtpPhoneCurrent] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [otpPhoneNew, setOtpPhoneNew] = useState("");



  const [showAddUpi, setShowAddUpi] = useState(false);
  const [newUpi, setNewUpi] = useState({ bank: '', upi: '' });
  const [newBank, setNewBank] = useState({ bank: '', accountNumber: ''});





  const updateField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };


  const renderEditableField = (label, name, type = "text") => {
    const isSecure = name === 'email' || name === 'phone';
    const verifyState = name === 'email' ? verifyEmail : verifyPhone;
    const otpValue = name === 'email' ? otpEmail : otpPhone;

    return (
      <div className="space-y-1">
        <Label>{label}</Label>
        <div className="flex items-center gap-2">
          {editField === name ? (
            isSecure && !verifyState ? (
              <div className="flex gap-2 w-full">
                <Input
                  placeholder="Enter OTP"
                  value={otpValue}
                  onChange={(e) => name === 'email' ? setOtpEmail(e.target.value) : setOtpPhone(e.target.value)}
                />
                <Button
                  onClick={() => {
                    if (otpValue === '123456') {
                      name === 'email' ? setVerifyEmail(true) : setVerifyPhone(true);
                      alert("Verified successfully");
                    } else {
                      alert("Invalid OTP");
                    }
                  }}
                >
                  Verify
                </Button>
              </div>
            ) : (
              <Input
                type={type}
                name={name}
                value={profile[name]}
                onChange={(e) => updateField(name, e.target.value)}
                onBlur={() => setEditField(null)}
                autoFocus
              />
            )
          ) : (
            <div className="flex-1 py-2 px-3 border rounded text-sm text-muted-foreground bg-gray-50">
              {profile[name] || '—'}
            </div>
          )}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => {
              if (isSecure && !verifyState) {
                alert(`OTP sent to current ${name}`);
              }
              setEditField(name);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader><CardTitle>Student Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {renderEditableField("Full Name", "name")}

          {/* PHONE SECURE CHANGE */}
          <div className="space-y-1">
            <Label>Phone Number</Label>
            <div className="flex items-center gap-2">
              {editField === "phone" ? (
                phoneStep === "verify_current" ? (
                  <>
                    <Input
                      placeholder="Enter OTP sent to current number"
                      value={otpPhoneCurrent}
                      onChange={(e) => setOtpPhoneCurrent(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        if (otpPhoneCurrent === "111111") {
                          setPhoneStep("enter_new");
                          alert("Current phone verified!");
                        } else {
                          alert("Invalid OTP");
                        }
                      }}
                    >
                      Verify
                    </Button>
                  </>
                ) : phoneStep === "enter_new" ? (
                  <>
                    <Input
                      placeholder="New Phone Number"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        if (newPhone.length < 10) {
                          alert("Invalid phone number");
                          return;
                        }
                        alert(`OTP sent to ${newPhone}`);
                        setPhoneStep("verify_new");
                      }}
                    >
                      Send OTP
                    </Button>
                  </>
                ) : phoneStep === "verify_new" ? (
                  <>
                    <Input
                      placeholder="OTP for new number"
                      value={otpPhoneNew}
                      onChange={(e) => setOtpPhoneNew(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        if (otpPhoneNew === "222222") {
                          updateField("phone", newPhone);
                          setNewPhone("");
                          setOtpPhoneCurrent("");
                          setOtpPhoneNew("");
                          setEditField(null);
                          setPhoneStep("idle");
                          setHasChanges(true);
                          alert("Phone number updated!");
                        } else {
                          alert("Invalid OTP");
                        }
                      }}
                    >
                      Confirm Change
                    </Button>
                  </>
                ) : null
              ) : (
                <div className="flex-1 py-2 px-3 border rounded text-sm text-muted-foreground bg-gray-50">
                  {profile.phone}
                </div>
              )}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => {
                  alert(`OTP sent to ${profile.phone}`);
                  setPhoneStep("verify_current");
                  setEditField("phone");
                }}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* EMAIL SECURE CHANGE */}
          <div className="space-y-1">
            <Label>Email Address</Label>
            <div className="flex items-center gap-2">
              {editField === "email" ? (
                emailStep === "verify_current" ? (
                  <>
                    <Input
                      placeholder="Enter OTP sent to current email"
                      value={otpEmailCurrent}
                      onChange={(e) => setOtpEmailCurrent(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        if (otpEmailCurrent === "123456") {
                          setEmailStep("enter_new");
                          alert("Current email verified!");
                        } else {
                          alert("Invalid OTP");
                        }
                      }}
                    >
                      Verify
                    </Button>
                  </>
                ) : emailStep === "enter_new" ? (
                  <>
                    <Input
                      placeholder="New Email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        if (!newEmail.includes("@")) {
                          alert("Invalid email address");
                          return;
                        }
                        alert(`OTP sent to ${newEmail}`);
                        setEmailStep("verify_new");
                      }}
                    >
                      Send OTP
                    </Button>
                  </>
                ) : emailStep === "verify_new" ? (
                  <>
                    <Input
                      placeholder="OTP for new email"
                      value={otpEmailNew}
                      onChange={(e) => setOtpEmailNew(e.target.value)}
                    />
                    <Button
                      onClick={() => {
                        if (otpEmailNew === "654321") {
                          updateField("email", newEmail);
                          setNewEmail("");
                          setOtpEmailCurrent("");
                          setOtpEmailNew("");
                          setEditField(null);
                          setEmailStep("idle");
                          setHasChanges(true);
                          alert("Email updated!");
                        } else {
                          alert("Invalid OTP");
                        }
                      }}
                    >
                      Confirm Change
                    </Button>
                  </>
                ) : null
              ) : (
                <div className="flex-1 py-2 px-3 border rounded text-sm text-muted-foreground bg-gray-50">
                  {profile.email}
                </div>
              )}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => {
                  alert(`OTP sent to ${profile.email}`);
                  setEmailStep("verify_current");
                  setEditField("email");
                }}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* About */}
          <div className="space-y-1">
            <Label>About</Label>
            <div className="flex items-center gap-2">
              {editField === "about" ? (
                <Textarea
                  name="about"
                  value={profile.about}
                  onChange={(e) => {
                    updateField("about", e.target.value);
                    setHasChanges(true);
                  }}
                  onBlur={() => setEditField(null)}
                  autoFocus
                />
              ) : (
                <div className="flex-1 py-2 px-3 border rounded text-sm text-muted-foreground bg-gray-50">
                  {profile.about || '—'}
                </div>
              )}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setEditField("about")}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Save Changes Button */}
          {hasChanges && (
            <div className="pt-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  alert("Changes saved successfully!");
                  setHasChanges(false);
                }}
              >
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>



      <Card>
        <CardHeader><CardTitle>Password Security</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {!showPasswordVerify ? (
            <>
              <Label>Current Password</Label>
              <div className="flex gap-2">
                <Input type="password" value={enteredCurrentPassword} onChange={(e) => setEnteredCurrentPassword(e.target.value)} />
                <Button onClick={() => {
                  if (enteredCurrentPassword === "********") {
                    setShowPasswordVerify(true);
                    setEnteredCurrentPassword("");
                  } else {
                    alert("Incorrect password");
                  }
                }}>Verify</Button>
              </div>
            </>
          ) : (
            <>
              <Label>New Password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <Label>Confirm Password</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <Button onClick={() => {
                if (newPassword === confirmPassword) {
                  alert("Password changed!");
                  setShowPasswordVerify(false);
                } else {
                  alert("Passwords do not match");
                }
              }}>Change Password</Button>
            </>
          )}
        </CardContent>
      </Card>

     <Card>
  <CardHeader><CardTitle>Bank & UPI Details</CardTitle></CardHeader>
  <CardContent className="space-y-4">
    {/* Existing Accounts List */}
    {accounts.length > 0 ? accounts.map((acc, i) => (
      <div key={i} className="border p-2 rounded flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">
            {acc.type === "upi" ? acc.upi : acc.accountNumber}
          </p>
          <p className="text-xs text-muted-foreground">{acc.bank}</p>
          {acc.default && <p className="text-green-600 text-xs">Default</p>}
        </div>
        <div className="flex gap-2">
          {!acc.default && (
            <Button
              size="sm"
              onClick={() =>
                setAccounts(accounts.map((a, idx) => ({ ...a, default: idx === i })))
              }
            >
              Make Default
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setAccounts(accounts.filter((_, idx) => idx !== i))}
          >
            Remove
          </Button>
        </div>
      </div>
    )) : (
      <p className="text-sm text-muted-foreground">No bank or UPI accounts added yet.</p>
    )}

    {/* Mode Selector */}
    {!bankInputMode && (
      <div className="flex gap-3">
        <Button onClick={() => setBankInputMode("bank")}>Add Bank Account</Button>
        <Button onClick={() => setBankInputMode("upi")}>Add UPI</Button>
      </div>
    )}

    {/* UPI Form */}
    {bankInputMode === "upi" && (
      <div className="space-y-2 border p-3 rounded">
        <Input
          placeholder="Bank Name"
          value={newUpi.bank}
          onChange={(e) => setNewUpi({ ...newUpi, bank: e.target.value })}
        />
        <Input
          placeholder="UPI ID (e.g. yourname@upi)"
          value={newUpi.upi}
          onChange={(e) => setNewUpi({ ...newUpi, upi: e.target.value })}
        />
        <div className="flex gap-2">
          <Button
            onClick={() => {
              if (!newUpi.bank || !newUpi.upi) {
                alert("Please fill in all fields.");
                return;
              }
              setAccounts([...accounts, { ...newUpi, type: "upi", default: false }]);
              setNewUpi({ bank: "", upi: "" });
              setBankInputMode("");
            }}
          >
            Save
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setNewUpi({ bank: "", upi: "" });
              setBankInputMode("");
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    )}

    {/* Bank Account Form */}
    {bankInputMode === "bank" && (
      <div className="space-y-2 border p-3 rounded">
        <Input
          placeholder="Bank Name"
          value={newBank.bank}
          onChange={(e) => setNewBank({ ...newBank, bank: e.target.value })}
        />
        <Input
          placeholder="Account Holder Name"
          value={newBank.holder}
          onChange={(e) => setNewBank({ ...newBank, holder: e.target.value })}
        />
        <Input
          placeholder="Account Number"
          value={newBank.accountNumber}
          onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
        />
        <Input
          placeholder="CVV"
          value={newBank.cvv}
          onChange={(e) => setNewBank({ ...newBank, cvv: e.target.value })}
          type="password"
        />
        <div className="flex gap-2 items-center">
          <Label className="text-sm">Expiry Date</Label>
          <Input
            type="month"
            value={newBank.expiry}
            onChange={(e) => setNewBank({ ...newBank, expiry: e.target.value })}
          />
        </div>
        

        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => {
              if (
                !newBank.bank ||
                !newBank.holder ||
                !newBank.accountNumber ||
                !newBank.cvv ||
                !newBank.expiry
              ) {
                alert("Please fill in all fields.");
                return;
              }

              setAccounts([...accounts, { ...newBank, type: "bank", default: false }]);
              setNewBank({ bank: "", holder: "", accountNumber: "", cvv: "", expiry: ""});
              setBankInputMode("");
            }}
          >
            Save
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setNewBank({ bank: "", holder: "", accountNumber: "", cvv: "", expiry: "" });
              setBankInputMode("");
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    )}
  </CardContent>
</Card>




      <Card>
        <CardHeader><CardTitle>Academic History</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {academicHistory.map((row, index) => (
            <div key={index} className="grid grid-cols-4 gap-2">
              <Input value={row.institute} onChange={(e) => {
                const updated = [...academicHistory];
                updated[index].institute = e.target.value;
                setAcademicHistory(updated);
              }} placeholder="Institute" />
              <Input value={row.year} onChange={(e) => {
                const updated = [...academicHistory];
                updated[index].year = e.target.value;
                setAcademicHistory(updated);
              }} placeholder="Year" />
              <Input value={row.subject} onChange={(e) => {
                const updated = [...academicHistory];
                updated[index].subject = e.target.value;
                setAcademicHistory(updated);
              }} placeholder="Subject" />
              <Input value={row.percentage} onChange={(e) => {
                const updated = [...academicHistory];
                updated[index].percentage = e.target.value;
                setAcademicHistory(updated);
              }} placeholder="Percentage" />
            </div>
          ))}
          <Button onClick={() => setAcademicHistory([...academicHistory, { institute: '', year: '', subject: '', percentage: '' }])}>
            Add Row
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Privacy Settings</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(profile.privacy).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <Label className="capitalize">Show {key}</Label>
              <Switch
                checked={value}
                onCheckedChange={(val) =>
                  setProfile((prev) => ({
                    ...prev,
                    privacy: { ...prev.privacy, [key]: val },
                  }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/*
      */}
    </div>
  );
}

import Button from '../../../components/ui/Button.jsx';
import FormField from '../../../components/ui/FormField.jsx';
import Input from '../../../components/ui/Input.jsx';
import Badge from '../../../components/ui/Badge.jsx';

export default function MemberFields({
  members = [],
  onChange,
  leaderEmail = '',
  minTeamSize = 1,
  maxTeamSize = 3,
  fieldErrors = {},
}) {
  const handleMemberChange = (index, field, value) => {
    const updated = members.map((m, idx) => {
      if (idx === index) {
        return { ...m, [field]: value };
      }
      return m;
    });
    onChange(updated);
  };

  const addMember = () => {
    if (members.length < maxTeamSize) {
      onChange([...members, { name: '', email: '', phone: '' }]);
    }
  };

  const removeMember = (index) => {
    if (members.length > minTeamSize && index !== 0) {
      onChange(members.filter((_, idx) => idx !== index));
    }
  };

  return (
    <div className="member-fields-group">
      <div className="member-fields-header">
        <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cloud-white)' }}>
          Team Members ({members.length}/{maxTeamSize})
        </h4>
        <span style={{ fontSize: 'var(--fs-label-xs)', color: 'var(--text-secondary)', fontFamily: 'var(--font-label)' }}>
          Min {minTeamSize} · Max {maxTeamSize}
        </span>
      </div>

      {members.map((member, idx) => {
        const isLeader = idx === 0;
        return (
          <div key={idx} className="member-card">
            <div className="member-card__header">
              <span className="member-card__title">
                {isLeader ? (
                  <Badge tone="yellow" icon="★">
                    Team Leader
                  </Badge>
                ) : (
                  <Badge tone="cyan" icon="◆">
                    Member {idx + 1}
                  </Badge>
                )}
              </span>

              {!isLeader && members.length > minTeamSize && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMember(idx)}
                  aria-label={`Remove Member ${idx + 1}`}
                  style={{ color: 'var(--color-pixel-pink)', padding: '0 8px' }}
                >
                  ✕ Remove
                </Button>
              )}
            </div>

            <div className="form-grid-3">
              <FormField
                id={`member-${idx}-name`}
                label="Full Name"
                required
                error={fieldErrors[`members[${idx}].name`]}
              >
                <Input
                  id={`member-${idx}-name`}
                  value={member.name}
                  onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  error={!!fieldErrors[`members[${idx}].name`]}
                />
              </FormField>

              <FormField
                id={`member-${idx}-email`}
                label="Email"
                required
                error={fieldErrors[`members[${idx}].email`]}
              >
                <Input
                  id={`member-${idx}-email`}
                  type="email"
                  value={isLeader ? (leaderEmail || member.email) : member.email}
                  readOnly={isLeader}
                  onChange={(e) => !isLeader && handleMemberChange(idx, 'email', e.target.value)}
                  placeholder="name@college.edu"
                  error={!!fieldErrors[`members[${idx}].email`]}
                  style={isLeader ? { opacity: 0.85, cursor: 'not-allowed' } : undefined}
                />
              </FormField>

              <FormField
                id={`member-${idx}-phone`}
                label="Phone Number"
                required
                error={fieldErrors[`members[${idx}].phone`]}
              >
                <Input
                  id={`member-${idx}-phone`}
                  type="tel"
                  value={member.phone}
                  onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                  placeholder="9876543210"
                  error={!!fieldErrors[`members[${idx}].phone`]}
                />
              </FormField>
            </div>
          </div>
        );
      })}

      {members.length < maxTeamSize && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addMember}
          style={{ marginTop: 'var(--space-s)', width: '100%' }}
        >
          + Add Team Member
        </Button>
      )}
    </div>
  );
}

import { useState } from 'react'
import toast from 'react-hot-toast'
import {FiShield, FiMapPin, FiCalendar } from 'react-icons/fi'
import {PONDS } from '../utils/mockData'
// import { Label, Input } from '../components/ui/Field'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { t } = useLanguage()
  const [editing, setEditing] = useState(false)
  const {user} = useAuth()
  const handleSave = () => {
    setEditing(false)
    toast.success(t('profilePage.profileUpdated'))
  }
  const initials = user?.fullname
  ?.split(' ')
  .map((w) => w[0])
  .slice(0, 2)
  .join('')
  .toUpperCase() || '?'

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-abyss-900 dark:text-mist-50">{t('profilePage.title')}</h1>
        <p className="mt-1 text-sm text-abyss-500 dark:text-mist-200/50">{t('profilePage.subtitle')}</p>
      </div>

      <div className="panel p-6">
        <div className="flex flex-col items-center gap-4 border-b border-mist-100 dark:border-abyss-800 pb-6 sm:flex-row">
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-current-500 to-signal-500 font-display text-2xl font-bold text-white shadow-glow">
            {initials}
          </span>
          <div className="text-center sm:text-left">
            <h2 className="font-display text-lg font-semibold text-abyss-900 dark:text-mist-50">{user.fullname}</h2>
            <p className="text-sm text-abyss-500 dark:text-mist-200/50">{user.role}</p>
          </div>
          <Button variant="ghost" className="sm:ml-auto" onClick={() => setEditing(true)}>
            {t('profilePage.editProfile')}
          </Button>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ProfileField icon={FiShield} label={t('profilePage.role')} value={user.role} />
          <ProfileField icon={FiMapPin} label={t('profilePage.pondsManaged')} value={PONDS.map((p) => p.name.split('—')[0].trim()).join(', ')} />
          <ProfileField icon={FiCalendar} label={t('profilePage.memberSince')} value={user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : '—'} />
        </dl>
      </div>

      <div className="panel p-6">
        <h3 className="font-display text-sm font-semibold text-abyss-900 dark:text-mist-50">{t('profilePage.security')}</h3>
        <p className="mt-1 text-sm text-abyss-500 dark:text-mist-200/50">{t('profilePage.securityDesc')}</p>
        <Button variant="subtle" className="mt-4">{t('profilePage.changePassword')}</Button>
      </div>

      <Modal
        open={editing}
        onClose={() => setEditing(false)}
        title={t('profilePage.editProfileModalTitle')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleSave}>{t('common.save')}</Button>
          </>
        }
      >
        {/* <div className="space-y-4">
          <div>
            <Label htmlFor="name">{t('profilePage.fullName')}</Label>
            <Input id="name" value={user.fullname} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="pemail">{t('profilePage.email')}</Label>
            <Input id="pemail" type="email" value={user.email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div> */}
      </Modal>
    </div>
  )
}
function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mist-100 dark:bg-abyss-800 text-abyss-500 dark:text-mist-200/50">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0">
        <dt className="eyebrow">{label}</dt>
        <dd className="mt-0.5 truncate text-sm font-medium text-abyss-800 dark:text-mist-50">{value}</dd>
      </div>
    </div>
  )
}
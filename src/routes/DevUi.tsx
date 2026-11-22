import { useTranslation } from 'react-i18next'
import { Alert } from '@/components/ui/Alert'
import { Badge, type Tone } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Container, Section } from '@/components/ui/Container'
import { Input, Select, Textarea } from '@/components/ui/FormControls'
import { SampleBadge } from '@/components/ui/SampleBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { getServices } from '@/lib/content'

const tones: Tone[] = ['neutral', 'primary', 'success', 'warning', 'danger', 'info']
const alertTones = ['info', 'success', 'warning', 'danger'] as const

/** Dev-only showcase of every primitive (route is not registered in production builds). */
export default function DevUi() {
  const { t, i18n } = useTranslation()
  return (
    <Container>
      <h1 className="pt-8 text-2xl font-bold md:text-3xl">{t('devui.title')}</h1>

      <Section title={t('devui.buttons')}>
        <div className="flex flex-wrap gap-2">
          <Button>{t('devui.primary')}</Button>
          <Button variant="secondary">{t('devui.secondary')}</Button>
          <Button variant="ghost">{t('devui.ghost')}</Button>
          <Button disabled>{t('devui.disabled')}</Button>
          <Button size="sm">sm</Button>
          <Button size="lg">lg</Button>
        </div>
      </Section>

      <Section title={t('devui.badges')}>
        <div className="flex flex-wrap gap-2">
          {tones.map((tone) => (
            <Badge key={tone} tone={tone}>
              {tone}
            </Badge>
          ))}
          <SampleBadge sample />
        </div>
      </Section>

      <Section title={t('devui.content')}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {getServices().map((s) => (
            <Card key={s.slug}>
              <div className="mb-2">
                <SampleBadge sample={s.sample} />
              </div>
              <h3 className="mb-1 font-bold">
                {i18n.language === 'fil' ? s.title_fil : s.title_en}
              </h3>
              <p className="text-sm text-muted">{s.category}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t('devui.cards')}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Card key={n}>
              <h3 className="mb-1 font-bold">{t('devui.cardTitle')}</h3>
              <p className="text-sm text-muted">{t('devui.cardText')}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section title={t('devui.alerts')}>
        <div className="space-y-3">
          {alertTones.map((tone) => (
            <Alert key={tone} tone={tone} title={t('devui.alertTitle')}>
              {t('devui.alertText')}
            </Alert>
          ))}
        </div>
      </Section>

      <Section title={t('devui.forms')}>
        <div className="max-w-md space-y-4">
          <Input label={t('devui.inputLabel')} hint={t('devui.inputHint')} />
          <Input type="email" label={t('devui.errorLabel')} error={t('devui.errorText')} />
          <Textarea label={t('devui.textareaLabel')} />
          <Select label={t('devui.selectLabel')}>
            <option>{t('devui.optionA')}</option>
            <option>{t('devui.optionB')}</option>
          </Select>
        </div>
      </Section>

      <Section title={t('devui.skeleton')}>
        <div className="max-w-md space-y-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </Section>
    </Container>
  )
}

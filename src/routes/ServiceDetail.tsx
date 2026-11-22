import { useParams } from 'react-router'
import PagePlaceholder from '@/components/layout/PagePlaceholder'

export default function ServiceDetail() {
  const { slug } = useParams()
  return <PagePlaceholder titleKey="pages.serviceDetail" detail={slug} />
}

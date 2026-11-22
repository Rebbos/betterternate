import { useParams } from 'react-router'
import PagePlaceholder from '@/components/layout/PagePlaceholder'

export default function BarangayDetail() {
  const { slug } = useParams()
  return <PagePlaceholder titleKey="pages.barangayDetail" detail={slug} />
}

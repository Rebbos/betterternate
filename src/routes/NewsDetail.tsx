import { useParams } from 'react-router'
import PagePlaceholder from '@/components/layout/PagePlaceholder'

export default function NewsDetail() {
  const { slug } = useParams()
  return <PagePlaceholder titleKey="pages.newsDetail" detail={slug} />
}

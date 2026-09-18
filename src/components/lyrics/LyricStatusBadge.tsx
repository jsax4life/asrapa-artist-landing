import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';

const statusKey = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === 'approved') return 'approved';
  if (normalized === 'rejected') return 'rejected';
  return 'pending';
};

export function LyricStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  const key = statusKey(status);

  if (key === 'approved') {
    return (
      <Badge variant="default" className="bg-primary/90">
        {t('lyricsPage.status.approved')}
      </Badge>
    );
  }

  if (key === 'rejected') {
    return <Badge variant="destructive">{t('lyricsPage.status.rejected')}</Badge>;
  }

  return (
    <Badge variant="secondary" className="border border-warning/40 text-warning-foreground bg-warning/10">
      {t('lyricsPage.status.pending')}
    </Badge>
  );
}

export function LyricPendingNotice() {
  const { t } = useTranslation();
  return (
    <p className="text-sm text-muted-foreground border border-border rounded-md p-3 bg-muted/40">
      {t('lyricsPage.pendingNotice')}
    </p>
  );
}

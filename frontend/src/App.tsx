import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { Button } from "@/components/ui/button";
import { Edit2, Check } from "lucide-react";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { WidgetEditorPanel } from "@/components/dashboard/WidgetEditorPanel";

function DashboardApp() {
  const {
    dashboards,
    activeDashboardId,
    setActiveDashboardId,
    addDashboard,
    deleteDashboard,
    renameDashboard,
    widgets,
    layout,
    updateActiveDashboard,
    isEditing,
    setIsEditing,
    activePanel,
    setActivePanel,
    activeView,
    setActiveView,
    startEditingWidget,
    editingWidget,
    updateEditingWidget,
    saveEditingWidget,
    cancelEditingWidget,
    deleteWidget,
    selectedDate,
    setSelectedDate,
    data
  } = useDashboard();

  const handleLayoutChange = (newLayout: any[]) => {
    updateActiveDashboard({ layout: newLayout });
  };

  const renderRightPanel = () => {
    if (activePanel === 'editor') {
      return (
        <WidgetEditorPanel
          onClose={cancelEditingWidget}
          onSave={saveEditingWidget}
          onChange={updateEditingWidget}
          widget={editingWidget}
        />
      );
    }
    if (activePanel === 'settings') {
      return (
        <SettingsPanel
          onClose={() => setActivePanel('none')}
        />
      );
    }
    return null;
  };

  return (
    <MainLayout
      rightPanel={renderRightPanel()}
      selectedDate={selectedDate}
      onDateChange={(date) => date && setSelectedDate(date)}
      onSettingsClick={() => setActivePanel(activePanel === 'settings' ? 'none' : 'settings')}

      dashboards={dashboards}
      activeDashboardId={activeDashboardId}
      onDashboardSelect={(id) => {
        setActiveDashboardId(id);
        setActiveView('dashboard');
      }}
      onDashboardAdd={addDashboard}
      onDashboardDelete={deleteDashboard}
      onDashboardRename={renameDashboard}
      
      activeView={activeView}

      headerActions={
        activeView === 'dashboard' ? (
          <>
            {isEditing && (
              <Button onClick={() => startEditingWidget()} variant="secondary" size="sm" className="hidden sm:inline-flex">
                Add Widget
              </Button>
            )}
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (isEditing) {
                  if (activePanel === 'editor') setActivePanel('none');
                }
                setIsEditing(!isEditing);
              }}
              className="gap-2"
            >
              {isEditing ? <Check className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
              {isEditing ? "Done" : "Edit"}
            </Button>
          </>
        ) : null
      }
    >
      {activeView === 'dashboard' && (
        <DashboardGrid
          widgets={widgets}
          layout={layout}
          isEditing={isEditing}
          onLayoutChange={handleLayoutChange}
          onEditWidget={startEditingWidget}
          onDeleteWidget={deleteWidget}
          onWidgetChange={updateEditingWidget}
          data={data}
          selectedDate={selectedDate}
        />
      )}
    </MainLayout>
  );
}

function App() {
  return (
    <DashboardProvider>
      <DashboardApp />
    </DashboardProvider>
  );
}

export default App;
